Go 에이전트 (가볍고 빠른 수집) ➡️ Java 백엔드 (안정적인 동시성 데이터 중계) ➡️ Vue.js (SFC 기반의 빠른 렌더링 화면)

기존의 결합도가 높았던 웹소켓과 차트 로직을 부모-자식 컴포넌트 구조로 분리하여 차트의 재사용성을 극대화했다. 부모 컴포넌트가 데이터 수집 및 상태 관리를 전담하게 함으로써, 향후 다중 호스트(Multi-host) 데이터가 들어왔을 때 화면에 차트를 동적으로 확장(v-for rendering)할 수 있는 아키텍처적 기반을 마련했다."

![Monitoring System Example](doc/MonitoringSystem.png)
