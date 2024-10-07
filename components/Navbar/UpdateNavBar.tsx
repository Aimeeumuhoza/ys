import React, { Fragment, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { useRouter } from 'next/router'
import { ENV } from '../../config/constants'
import TopNavBar from './TopNavBar'
import {
  UserOutlined,
  ShoppingOutlined,
  SearchOutlined,
  DownOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import Form from 'react-bootstrap/Form'
import { useCart } from '../../contexts/Cart'
import Bag from '../Bag/BagDrawer'
import { throttle } from '../../utils/throttle'
import { useAuth } from '../../contexts/Auth'
import { message } from 'antd'
import useLogout from '../../hooks/api/useLogout'
import useHandleState from '../../hooks/useHandleState'
import Dropdown from 'antd/lib/dropdown'
import Avatar from 'antd/lib/avatar'
import Menu from 'antd/lib/menu'
import Link from 'next/link'
import Button from 'antd/lib/button'
import RepairModal from './Modals/Repair/RepairModel'
import ResellModal from './Modals/Resell/ResellModal'
import DonateModal from './Modals/Donate/DonateModal'
import useConvertCurrency from '../../contexts/CurrencyConversion/CurrencyConversionContext'
const UpdateNavBar = (): JSX.Element => {
  const router = useRouter()
  const cartHook = useCart()
  const authHook = useAuth()
  const logoutHook = useLogout()
  const onClose = (): void => setVisible(false)
  const [visible, setVisible] = useState(false)
  const [searchItem, setSearch] = useState('')
  const [isRepairModalVisible, setIsRepairModalVisible] = useState(false)
  const [isResellModalVisible, setIsResellModalVisible] = useState(false)
  const [isDonateModalVisible, setIsDonateModalVisible] = useState(false)
  // const { changeCurrencyRate } = useConvertCurrency();
  // const [displayLogin, setDisplayLogin] = useState(false)
  const handleChangeCurrency = () => {// Change to the desired currency, e.g., 'USD'
  }

  useHandleState(logoutHook, {
    onSuccess: () => authHook.logoutUserLocally(),
    onError: () => message.error('Could not log you out, try again later '),
  })

  const DonateHandleClick = () => {
    setIsDonateModalVisible(true)
  }

  const handleClick = () => {
    setIsRepairModalVisible(true)
  }

  const repairHandleOk = (): void => {
    setIsRepairModalVisible(false)
    router.push('/')
  }

  const repairHandleCancel = (): void => {
    setIsRepairModalVisible(false)
  }

  const resellHandleClick = () => {
    setIsResellModalVisible(true)
  }
  const resellOkBtn = (): void => {
    setIsResellModalVisible(false)
    router.push('/')
  }
  const resellCancelBtn = (): void => {
    setIsResellModalVisible(false)
  }

  const donateCancelBtn = (): void => {
    setIsDonateModalVisible(false)
  }

  const donateOkBtn = (): void => {
    setIsDonateModalVisible(false)
  }

  const menu = (
    <Menu className="shopper_user_settings">
      <Menu.Item key="0" className="mabo8">
        <Link href="/user-profile?tabIndex=1">
          <span className="text14 black fowe700 ">
            <UserOutlined className="my_icon" />
            <span className="ml-1">My Account</span>
          </span>
        </Link>
      </Menu.Item>

      <Menu.Item key="1" className="mabo8">
        <Link href="/user-profile?tabIndex=2">
          <span className="text14 black fowe700">
            <InfoCircleOutlined className="my_icon" />
            <span className="ml-1"> My Orders</span>
          </span>
        </Link>
      </Menu.Item>

      <Menu.Divider />

      <Menu.Item
        disabled={logoutHook.isLoading}
        key="4"
        style={{ textAlign: 'right' }}
        onClick={() => logoutHook.sendRequest()}>
        <Fragment>
          <span className="text14 gray fowe700 mr-2">
            {logoutHook.isLoading ? 'Logging out...' : 'Logout'}
          </span>
          {!logoutHook.isLoading && (
            <img src="/arrows-right.svg" alt="arrows-image" height="12px" />
          )}
        </Fragment>
      </Menu.Item>
    </Menu>
  )
  return (
    <Fragment>
      <TopNavBar />
      <Navbar
        expand="lg"
        bg="white"
        className="container-fluid uzuri_container"
        collapseOnSelect
        variant="white">
        <Container fluid>
          <Navbar.Brand
            href=""
            onClick={(e) => {
              e.preventDefault()
              router.push('/')
            }}>
            <img
              src={ENV === 'beta' ? '/logobeta.png' : '/uzuri_logo_black.svg'}
              alt="logo"
              className="logoImage"
              height={38}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto myNav">
              <Nav.Link style={{ display: 'flex' }}>
                <div className="d-block d-sm-none">
                  <Form className="searchform">
                    <input
                      type="search"
                      id="search-box"
                      placeholder="Search a product"
                      onChange={({ target }) => {
                        setSearch((prevState) => {
                          prevState = target.value
                          return prevState
                        })
                        throttle(
                          () =>
                            router.push({
                              pathname: '/products',
                              query: { 'pp_._name__contains': searchItem },
                            }),
                          200,
                        )
                      }}
                    />
                    <SearchOutlined
                      onClick={() =>
                        router.push({
                          pathname: '/products',
                          query: { 'pp_._name__contains': searchItem },
                        })
                      }
                      style={{ fontSize: '23px' }}
                    />
                  </Form>
                </div>
                <div className="d-block d-sm-none">
                  <ShoppingOutlined
                    style={{
                      fontSize: '30px',
                      verticalAlign: 'middle',
                    }}
                    onClick={(): void => setVisible(true)}
                  />
                  <span className="hide_phone" style={{ marginLeft: '0px', fontSize: '10px' }}>
                    ({cartHook.cartItems.length}){' '}
                  </span>
                </div>
              </Nav.Link>
              <NavDropdown title="Women" id="nav-dropdown">
                <NavDropdown.Item
                  onClick={() => router.replace(`/products?pt_._name__in=Women+sandals`)}>
                  Womens sandals
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => router.replace(`/products?pt_._name__in=Women%27s+gift+card`)}>
                  Womens gift card
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => router.replace(`/products?pt_._name__in=Women+Closed+Shoes`)}>
                  Womens Closed Shoes
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => router.replace(`/products?pt_._name__in=Women+bags`)}>
                  Womens bags
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Men" id="nav-dropdown">
                <NavDropdown.Item
                  onClick={() => router.replace(`/products?pt_._name__in=Men+sandals`)}>
                  Men sandals
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Kids" id="nav-dropdown">
                <NavDropdown.Item
                  onClick={() => router.replace(`/products?pt_._name__in=Kids+sandals`)}>
                  Kids sandals
                </NavDropdown.Item>
                {/* <NavDropdown.Item
                  onClick={() => router.replace(`/products?pt_._name__in=Kid%27s+gift+card`)}>
                  Kids gift card
                </NavDropdown.Item> */}
              </NavDropdown>

              <NavDropdown title="Circular center" id="nav-dropdown">
                <NavDropdown.Item onClick={handleClick}>Repair</NavDropdown.Item>
                {isRepairModalVisible && (
                  <RepairModal
                    isRepairModalVisible={isRepairModalVisible}
                    repairHandleOk={repairHandleOk}
                    handleCancel={repairHandleCancel}
                  />
                )}
                <NavDropdown.Item onClick={resellHandleClick}>Resell</NavDropdown.Item>
                {isResellModalVisible && (
                  <ResellModal
                    isResellModalVisible={isResellModalVisible}
                    resellCancelBtn={resellCancelBtn}
                    resellOkBtn={resellOkBtn}
                  />
                )}
                <NavDropdown.Item onClick={DonateHandleClick}>Donate</NavDropdown.Item>
                {isDonateModalVisible && (
                  <DonateModal
                    isDonateModalVisible={isDonateModalVisible}
                    cancelBtn={donateCancelBtn}
                    okBtn={donateOkBtn}
                  />
                )}
              </NavDropdown>
              <NavDropdown title="Gift cards" id="nav-dropdown">
                <NavDropdown.Item
                  onClick={() => router.replace(`/products?c_._name__in=Merchandise`)}>
                  Gift cards
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/login" className="d-block d-sm-none">
                <Button className="btn_primary_large">Login</Button>
              </Nav.Link>
            </Nav>
            <div className="search_section hide_phone">
              <Form className="d-flex searchform ">
                <input
                  type="search"
                  id="search-box"
                  placeholder="Search a product"
                  onChange={({ target }) => {
                    setSearch((prevState) => {
                      prevState = target.value
                      return prevState
                    })
                    throttle(
                      () =>
                        router.push({
                          pathname: '/products',
                          query: { 'pp_._name__contains': searchItem },
                        }),
                      200,
                    )
                  }}
                />
                <SearchOutlined
                  onClick={() =>
                    router.push({
                      pathname: '/products',
                      query: { 'pp_._name__contains': searchItem },
                    })
                  }
                  style={{ fontSize: '23px' }}
                />
              </Form>
              <Button onClick={handleChangeCurrency}>Change currency</Button>{' '}
              {/* Button to change currency */}
            </div>

            <div className="login_section" style={{ marginRight: '20px' }}>
              {authHook.isLoggedIn ? (
                <div className="menu_item hide_phone">
                  <Dropdown trigger={['click']} overlay={menu}>
                    <span>
                      <Avatar
                        shape="circle"
                        src={authHook.loggedInUser?.profilePictureImgUrl || '/uzuri_avatar.png'}
                        className="align-self-center mr-2"
                        size={32}
                      />
                      <a
                        className="ant-dropdown-link text12 black fowe700 hide_phone"
                        href=""
                        onClick={(e) => e.preventDefault()}>
                        {`${authHook.loggedInUser?.lastName}`}{' '}
                      </a>
                      <DownOutlined
                        style={{
                          fontSize: '10px',
                          marginRight: '-10px',
                        }}
                      />
                    </span>
                  </Dropdown>
                </div>
              ) : (
                <div className="menu_item user_section hide_phone">
                  <a href="/login">
                    <UserOutlined
                      style={{
                        fontSize: '27px',
                        verticalAlign: 'middle',
                        marginTop: '-4px',
                      }}
                    />
                  </a>
                </div>
              )}
            </div>

            <div className="cart_section hide_phone">
              <ShoppingOutlined
                style={{
                  fontSize: '30px',
                  verticalAlign: 'middle',
                }}
                onClick={(): void => setVisible(true)}
              />
              <span style={{ marginLeft: '0px', fontSize: '10px' }}>
                ({cartHook.cartItems.length}){' '}
              </span>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Bag onClose={onClose} visible={visible} />
    </Fragment>
  )
}

export default UpdateNavBar
