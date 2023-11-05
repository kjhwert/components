# Core Component 만들기

> AntDesign, Meterial UI를 참고해서 Core Component를 만들어보자.

### Popover Component
#### 구현 내용
1. createPortal을 이용해서 별도의 DOM에서 띄울 것.Popover가 띄워졌을 때 상위, 하위 요소에 영향을 받지 않고 독립적으로 관리하기 위함.
2. children으로 전달된 요소를 기준으로 element의 위치를 찾아 Popover의 위치를 계산한다.

#### 테스트

### Select Component
