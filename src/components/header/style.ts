import styled from 'styled-components'

export const HeaderWrapper = styled.div`
  height: 75px;
  background-color: #ffffff;
  font-size: 14px;
  color: #242424;

  .content {
    display: flex;
    justify-content: space-between;
  }
`

export const HeaderLeftWrapper = styled.div`
  display: flex;

  .logo {
    display: block;
    width: 176px;
    height: 70px;
  }

  .title-list {
    display: flex;
    line-height: 70px;

    .item {
      position: relative;
    }
  }
`

export const HeaderRightWrapper = styled.div``
