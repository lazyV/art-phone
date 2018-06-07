import Vue from 'vue'
import Router from 'vue-router'

const HomePage = () => import('components/homepage/homepage')
const Share = () => import('components/share/share')
const Study = () => import('components/study/study')
const UserCenter = () => import('components/user-center/user-center')
const ChangePassword = () => import('components/change-password/change-password')
const UserDetail = () => import('components/user-detail/user-detail')
const Login = () => import('components/login/login')
const Register = () => import('components/register/register')
const MyWorks = () => import('components/my-works/my-works')
const AuthorCenter = () => import('components/author-center/author-center')
const WorkDetail = () => import('components/work-detail/work-detail')
const AllWorks = () => import('components/all-works/all-works')
const UserRanklist = () => import('components/user-ranklist/user-ranklist')
const UserCircle = () => import('components/user-circle/user-circle')
const MyCollections = () => import('components/my-collections/my-collections')
const MyAttentions = () => import('components/my-attentions/my-attentions')
const Course = () => import('components/course/course')
const Exhibition = () => import('components/exhibition/exhibition')
const ExhibitionDetail = () => import('components/exhibition-detail/exhibition-detail')
const MyExhibition = () => import('components/my-exhibition/my-exhibition')

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/homepage'
    },
    {
      path: '/homepage',
      component: HomePage
    },
    {
      path: '/study',
      component: Study,
      redirect: '/study/allWorks',
      children: [
        {path: 'allWorks', component: AllWorks},
        {path: 'circle', component: UserCircle},
        {path: 'rank', component: UserRanklist},
        {path: 'workDetail', component: WorkDetail},
        {path: 'login', component: Login}
      ]
    },
    {
      path: '/share',
      component: Share
    },
    {
      path: '/mine',
      component: UserCenter
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/userDetail',
      component: UserDetail
    },
    {
      path: '/study/authorCenter',
      component: AuthorCenter
    },
    {
      path: '/myWorks',
      component: MyWorks
    },
    {
      path: '/changePassword',
      component: ChangePassword
    },
    {
      path: '/workDetail',
      component: WorkDetail
    },
    {
      path: '/myCollections',
      component: MyCollections
    },
    {
      path: '/myAttentions',
      component: MyAttentions
    },
    {
      path: '/course',
      component: Course
    },
    {
      path: '/exhibition',
      component: Exhibition
    },
    {
      path: '/exhibitionDetail',
      component: ExhibitionDetail
    },
    {
      path: '/myExhibition',
      component: MyExhibition
    }
  ]
})
