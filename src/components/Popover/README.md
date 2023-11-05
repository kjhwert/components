# Popover Component
## 구현 내용
1. createPortal을 이용해서 별도의 DOM에서 띄울 것.Popover가 띄워졌을 때 상위, 하위 요소에 영향을 받지 않고 독립적으로 관리하기 위함.
2. children으로 전달된 요소를 기준으로 element의 위치를 찾아 Popover의 위치를 계산한다.

## 테스트

## 확인할 것
1. children으로 전달받은 요소의 ref는 어떻게 가져오고 어떻게 관리할지?
