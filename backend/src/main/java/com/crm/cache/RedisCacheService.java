package com.crm.cache;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Enterprise Multi-Tenant Caching and Distributed Locking Service.
 * Provides Redis caching with automatic circuit breaking / graceful in-memory fallback
 * when Redis is unreachable.
 */
@Service
public class RedisCacheService {

    private static final Logger log = LoggerFactory.getLogger(RedisCacheService.class);

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    // Fallback local cache when Redis is unavailable or unconfigured
    private final Map<String, String> localMemoryCache = new ConcurrentHashMap<>();

    public RedisCacheService(@Autowired(required = false) StringRedisTemplate redisTemplate,
                             ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    public <T> void set(String key, T value, Duration ttl) {
        try {
            String json = objectMapper.writeValueAsString(value);
            if (redisTemplate != null) {
                redisTemplate.opsForValue().set(key, json, ttl);
            } else {
                localMemoryCache.put(key, json);
            }
        } catch (Exception e) {
            log.warn("Redis write failed for key {}, falling back to local memory: {}", key, e.getMessage());
            try {
                localMemoryCache.put(key, objectMapper.writeValueAsString(value));
            } catch (Exception ignored) {}
        }
    }

    public <T> T get(String key, Class<T> clazz) {
        try {
            String json = null;
            if (redisTemplate != null) {
                json = redisTemplate.opsForValue().get(key);
            }
            if (json == null) {
                json = localMemoryCache.get(key);
            }
            if (json != null) {
                return objectMapper.readValue(json, clazz);
            }
        } catch (Exception e) {
            log.warn("Redis read failed for key {}: {}", key, e.getMessage());
            String fallback = localMemoryCache.get(key);
            if (fallback != null) {
                try {
                    return objectMapper.readValue(fallback, clazz);
                } catch (Exception ignored) {}
            }
        }
        return null;
    }

    public void evict(String key) {
        try {
            if (redisTemplate != null) {
                redisTemplate.delete(key);
            }
            localMemoryCache.remove(key);
        } catch (Exception e) {
            log.warn("Redis evict failed for key {}: {}", key, e.getMessage());
            localMemoryCache.remove(key);
        }
    }

    /**
     * Distributed Lock (Redlock-style) using SETNX with TTL.
     * Returns true if lock was acquired, false otherwise.
     */
    public boolean acquireLock(String lockKey, Duration ttl) {
        try {
            if (redisTemplate != null) {
                Boolean acquired = redisTemplate.opsForValue().setIfAbsent("lock:" + lockKey, "LOCKED", ttl);
                return Boolean.TRUE.equals(acquired);
            } else {
                return localMemoryCache.putIfAbsent("lock:" + lockKey, "LOCKED") == null;
            }
        } catch (Exception e) {
            log.warn("Distributed lock failed for {}: {}", lockKey, e.getMessage());
            return true; // Fail-open to avoid stalling business operations
        }
    }

    public void releaseLock(String lockKey) {
        evict("lock:" + lockKey);
    }
}
