DROP TABLE IF EXISTS system_mon.system_status_raw;

CREATE UNLOGGED TABLE system_mon.system_status_raw (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    hostname VARCHAR(50) NOT NULL,
    cpu_usage REAL NOT NULL,
    memory_usage REAL NOT NULL,
    rx BIGINT NOT NULL,
    tx BIGINT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_mon.system_status_daily (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    hostname VARCHAR(50) NOT NULL,
    cpu_avg DOUBLE PRECISION NOT NULL,                 -- double -> DOUBLE PRECISION (정밀한 평균값)
    cpu_max REAL NOT NULL,                             -- 하루 중 피크 타임 맥스값
    memory_avg DOUBLE PRECISION NOT NULL,
    memory_max REAL NOT NULL,
    network_rx_total BIGINT NOT NULL,                  -- 하루 동안의 총 전송량
    network_tx_total BIGINT NOT NULL,
    log_date DATE NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (log_date, hostname)                   -- 복합키 설정으로 조회 성능 최적화
)
;