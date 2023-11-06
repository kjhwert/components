# Popover Component
## 구현 내용
- 각 라이브러리의 코드를 확인해보고, 가장 괜찮다고 생각하는 방향으로 개발 진행

## 테스트 (테스트코드를 통해 구체적으로 정리 필요)
1. Popover 외부요소 클릭했을 때 닫히는지
2. Popover가 외부요소의 위치에 영향을 주거나 영향을 받지 않는지
3. Popover가 중첩되었을 때 UX가 어색하지 않은지

## Portal
> trigger 라이브러리(AntDesign), Meterial UI, 차크라 UI의 구현 방식 비교 

#### AntDesign
- createPortal을 활용하고 있다.
- trigger 라이브러리는 내부적으로 react-component/portal 라이브러리를 사용해서 Portal을 구성.
- getContainer 함수가 있으면 해당 데이터를 활용, 없으면 useDom hook으로 반환되는 container 활용

###### Portal Component
```typescript
export type ContainerType = Element | DocumentFragment;

export type GetContainer =
    | string
    | ContainerType
    | (() => ContainerType)
    | false;

const getPortalContainer = (getContainer: GetContainer) => {
    if (getContainer === false) {
        return false;
    }

    if (!canUseDom() || !getContainer) {
        return null;
    }

    if (typeof getContainer === 'string') {
        return document.querySelector(getContainer);
    }
    if (typeof getContainer === 'function') {
        return getContainer();
    }
    return getContainer;
};

const Portal = React.forwardRef<any, PortalProps>((props, ref) => {
    // getContainer로 전달받은 데이터를 토대로 container를 구성
    const [innerContainer, setInnerContainer] = React.useState(() => getPortalContainer(getContainer));

    const [defaultContainer, queueCreate] = useDom(
        mergedRender && !innerContainer,
        debug,
    );

    // createPortal에 활용되는 element
    const mergedContainer = innerContainer ?? defaultContainer;
}
```
###### useDom hook
```typescript
export default function useDom(render: boolean, debug?: string) {
    const [ele] = React.useState(() => {
        if (!canUseDom()) {
            return null;
        }

        const defaultEle = document.createElement('div');

        if (process.env.NODE_ENV !== 'production' && debug) {
            defaultEle.setAttribute('data-debug', debug);
        }

        return defaultEle;
    });

    // =========================== DOM ===========================
    function append() {
        if (!ele.parentElement) {
            document.body.appendChild(ele);
        }

        appendedRef.current = true;
    }

    function cleanup() {
        ele.parentElement?.removeChild(ele);

        appendedRef.current = false;
    }

    useLayoutEffect(() => {
        if (render) {
            if (queueCreate) {
                queueCreate(append);
            } else {
                append();
            }
        } else {
            cleanup();
        }

        return cleanup;
    }, [render]);
}
```


#### Meterial UI
- createPortal을 활용하고 있다.
- Portal props로 container를 받으면, 해당 element를 활용하고 없다면 document.body를 활용한다.
- `useEnhancedEffect`? SSR 대응을 위해 브라우저 환경인지를 확인하고 useLayoutEffect or useEffect ([코드 링크](https://github.com/mui/material-ui/blob/master/packages/mui-utils/src/useEnhancedEffect/useEnhancedEffect.ts))
```typescript
const useEnhancedEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;
```

AntDesign과 Meterial UI 라이브러리 모두 Portal을 활용해서 Popover를 구성하고 있고, `element(container)`를 넘겨받지 않으면 `document.body`에 해당요소를 생성한다. 

#### 차크라 UI
- 문서상으로는 default로 Portal을 쓰지 않는다고 되어있다.
- 무조건 Portal을 써야한다고 생각했는데, translate3d를 활용해서 노출한다. 상위, 하위 요소에 간섭이 없을까?
