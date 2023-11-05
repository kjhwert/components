# Popover Component
## 구현 내용
1. createPortal을 이용해서 별도의 DOM에서 띄울 것.Popover가 띄워졌을 때 상위, 하위 요소에 영향을 받지 않고 독립적으로 관리하기 위함.
2. children으로 전달된 요소를 기준으로 element의 위치를 찾아 Popover의 위치를 계산한다.

## 테스트

## 확인할 것
#### Portal
> trigger 라이브러리는 Portal을 구성할 때 어떻게 portal을 생성하고 관리하는지? 
- trigger 라이브러리는 내부적으로 react-component/portal 라이브러리를 사용해서 Portal을 구성.
- getContainer 함수가 있으면 해당 데이터를 활용, 없으면 useDom hook을 활용
1. getContainer
2. useDom hook
- useState 훅 내부에서 document.createElement
- useLayoutEffect hook에서 body에 append.
