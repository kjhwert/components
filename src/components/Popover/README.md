# Popover Component
## 구현 내용
- 각 라이브러리의 코드를 확인해보고, 가장 괜찮다고 생각하는 방향으로 개발 진행

## Portal
> trigger 라이브러리(AntDesign), Meterial UI, 차크라 UI의 구현 방식 비교 

#### AntDesign
- createPortal을 활용하고 있다.
- trigger 라이브러리는 내부적으로 react-component/portal 라이브러리를 사용해서 Portal을 구성.
- getContainer 함수가 있으면 해당 데이터를 활용, 없으면 useDom hook을 활용
1. getContainer
2. useDom hook
- useState 훅 내부에서 document.createElement
- useLayoutEffect hook에서 body에 append.

#### Meterial UI
- createPortal을 활용하고 있다.

#### 차크라 UI
- 문서상으로는 default로 Portal을 쓰지 않는다고 되어있다.
- 무조건 Portal을 써야한다고 생각했는데, translate3d를 활용해서 노출한다. 상위, 하위 요소에 간섭이 없을까?
