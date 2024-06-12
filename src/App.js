import { Routes, Route } from 'react-router-dom';
import { Blog, Contact, Home, Login, Register, Rental, HomePage, DetailPost, SearchDetail, Appointment, BlogDetail, SavedPost, Chat } from './containers/Public';
import { path } from './ultils/constant';
import * as actions from './store/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { System, CreatePost, ManagePost, EditAccount, ManageAppointment, PersonalAppointment, ScheduledAppointment, AddMoney, PostPayment, PaymentHistory } from './containers/System';
import { Dashboard, ManageAllPost, ManageSystem, ManageUser } from './containers/Dashboard';
import MoneyAddHistory from './containers/System/MoneyAddHistory';

function App() {
  const dispatch = useDispatch()


  useEffect(() => {

    dispatch(actions.getPrices())
    dispatch(actions.getAreas())
    dispatch(actions.getProvinces())
  }, [])
  return (
    <div className="bg-primary overflow-hidden ">
      <Routes>
        <Route path={path.HOME} element={<Home />}>
          <Route path='*' element={<HomePage />} />
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.REGISTER} element={<Register />} />
          <Route path={path.CHO_THUE_CAN_HO} element={<Rental />} />
          <Route path={path.CHO_THUE_PHONG_TRO} element={<Rental />} />
          <Route path={path.NHA_CHO_THUE} element={<Rental />} />
          <Route path={path.CHO_THUE_MAT_BANG} element={<Rental />} />
          <Route path={path.TIN_TUC} element={<Blog />} />
          <Route path={path.BLOG_DETAIL} element={<BlogDetail />} />
          <Route path={path.LIEN_HE} element={<Contact />} />
          <Route path={path.DETAIL_POST__TITLE__POSTID} element={<DetailPost />} />
          {/* <Route path={path.DETAIL_ALL} element={<DetailPost />} /> */}
          <Route path={path.SEARCH} element={<SearchDetail />} />
          <Route path={path.APPOINTMENT} element={<Appointment />} />
          <Route path={path.SAVED_POST} element={<SavedPost />} />

        </Route>
        <Route path={path.CHAT} element={<Chat />} />

        <Route path={path.SYSTEM} element={<System />}>
          <Route path={path.CREATE_POST} element={<CreatePost />} />
          <Route path={path.MANAGE_POST} element={<ManagePost />} />
          <Route path={path.ACCOUNT} element={<EditAccount />} />
          {/* <Route path={path.MANAGE_APPOINTMENT} element={<ManageAppointment />} /> */}
          <Route path={path.PERSONNAL_APPOINTMENT} element={<PersonalAppointment />} />
          <Route path={path.SCHEDULED_APPOINTMENT} element={<ScheduledAppointment />} />
          <Route path={path.ADD_MONEY} element={<AddMoney />} />
          <Route path={path.MONEY_ADD_HISTORY} element={<MoneyAddHistory />} />
          <Route path={path.POST_PAYMENT} element={<PostPayment />} />
          <Route path={path.PAYMENT_HISTORY} element={<PaymentHistory />} />
        </Route>

        <Route path={path.DASHBOARD} element={<Dashboard />}>
          <Route path={path.MANAGE_ALL_POST} element={<ManageAllPost />} />
          <Route path={path.MANAGE_ALL_USER} element={<ManageUser />} />
          <Route path={path.MANAGE_SYSTEM} element={<ManageSystem />} />

        </Route>





      </Routes>
    </div>
  );
}

export default App;