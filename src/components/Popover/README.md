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
- 무조건 Portal을 써야한다고 생각했는데, 차크라 UI는 optional하게 Portal을 적용한다. 기본적으로는 활용하지 않음. portal을 사용하지 않아서 주변 요소 layout에 영향을 주진 않을지?
- 요소의 position을 잡을 때는 translate3d를 활용해서 노출한다. 성능 상에 훨씬 이점이 있어보인다.

차크라 UI에서 Popover의 positioning을 하는 로직을 찾는데 꽤 어려움을 겪었다.
- Popover.tsx > usePopover > usePopper > setupPopper > createPopper
- createPopper는 @popperjs/core 라이브러리에서 제공하는 함수인데, 버전만 유지되고 floating-ui로 대체된 것 같다.

---
#### createPopper.js
- createPopper 함수가 return하는 값을 useRef를 활용해서 관리한다.
- useRef로 관리하는건 알겠는데, 어떻게 inline style로 입힌거지...? `instance.state.styles.popper`의 style하고 실제 적용된 스타일도 조금 다르다.

#### 궁금한 것
1. popperGenerator 함수 내에서 createPopper를 return하는 클로저를 구성하였는데, 이유가 뭘까?
2. 
---

- useDisclosure hook ?
- useEventListener hook은 유용한 것 같다. ([코드 참고](https://github.com/chakra-ui/chakra-ui/blob/main/packages/hooks/use-event-listener/src/index.ts))
