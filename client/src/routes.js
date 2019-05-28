import  Home        from './components/Home/Home.vue'
import  AdminMain   from './components/admin/AdminMain.vue'
import  Notice      from './components/admin/Notice/Notice.vue'
import  Chart       from './components/admin/Chart/Chart.vue'
import  ChartTerm   from './components/admin/Chart/ChartTerm.vue'
import  Users       from './components/admin/Users/Users.vue'
import  ChangeAdPwd from './components/admin/AdminSet/ChangeAdPwd.vue'

import  UserMain    from './components/user/UserMain.vue'
import  UNotice     from './components/user/Notice/Notice.vue'
import  UChart      from './components/user/Chart/Chart.vue'
import  UChartTerm  from './components/user/Chart/ChartTerm.vue'
import  ChangePwd   from './components/user/UserSet/ChangePwd.vue'

export const routes = [
  {
    path : '/', 
    component: Home
  },
  {
    path : '/admin',
    component: AdminMain,
    children: [
        {
            path : 'notice',
            component: Notice
        },
        {
            path : 'chart',
            component: Chart
        },
        {
            path : 'chartterm',
            component: ChartTerm
        },
        {
            path : 'users',
            component: Users
        },
        {
            path : 'changeadpwd',
            component: ChangeAdPwd
        },
    ]
  },
  {
    path : '/user',
    component: UserMain,
    children: [
        {
            path : 'notice',
            component: UNotice
        },
        {
            path : 'chart',
            component: UChart
        },
        {
            path : 'chartterm',
            component: UChartTerm
        },
        {
            path : 'changepwd',
            component: ChangePwd
        },
    ]
  },





 
]
