import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: false,
          title: '首页',
          notCache: false,
          icon: 'md-home'
        },
        // component: () => import('@/view/single-page/home')
        component: () => import('@/view/user/user.vue')
      }
    ]
  },
  {
    path: '/userManager',
    name: 'userManager',
    meta: {
      icon: 'md-person',
      title: '用户管理'
    },
    component: Main,
    children: [
      {
        path: '/user',
        name: 'user',
        meta: {
          title: '用户管理',
          icon: 'md-person'
        },
        component: () => import('@/view/user/user.vue')
      }
    ]
  },
  {
    path: '/productManager',
    name: 'productManager',
    meta: {
      icon: 'md-person',
      title: '产品管理'
    },
    component: Main,
    children: [
      {
        path: '/product',
        name: 'product',
        meta: {
          title: '产品管理',
          icon: 'md-person'
        },
        component: () => import('@/view/product/product.vue')
      },
      {
        path: '/productCategory',
        name: 'productCategory',
        meta: {
          title: '产品分类',
          icon: 'md-person'
        },
        component: () => import('@/view/product/category.vue')
      }
    ]
  },
  {
    path: '/orderManager',
    name: 'orderManager',
    meta: {
      icon: 'md-person',
      title: '订单管理'
    },
    component: Main,
    children: [
      {
        path: '/order',
        name: 'order',
        meta: {
          title: '订单管理',
          icon: 'md-person'
        },
        component: () => import('@/view/order/order.vue')
      }
    ]
  },
  {
    path: '/agentManager',
    name: 'agentManager',
    meta: {
      icon: 'md-person',
      title: '代理管理'
    },
    component: Main,
    children: [
      {
        path: '/agent',
        name: 'agent',
        meta: {
          title: '代理等级',
          icon: 'md-person'
        },
        component: () => import('@/view/agent/agent.vue')
      },
      {
        path: '/amount',
        name: 'amount',
        meta: {
          title: '代理商账户',
          icon: 'md-person'
        },
        component: () => import('@/view/agent/amount.vue')
      },
      {
        path: '/agentCharge',
        name: 'agentCharge',
        meta: {
          title: '代理商充值',
          icon: 'md-person'
        },
        component: () => import('@/view/agent/charge.vue')
      },
      {
        path: '/agentWithdraw',
        name: 'agentWithdraw',
        meta: {
          title: '代理商提现',
          icon: 'md-person'
        },
        component: () => import('@/view/agent/withdraw.vue')
      }
    ]
  },
  // {
  //   path: '/billManager',
  //   name: 'billManager',
  //   meta: {
  //     icon: 'md-person',
  //     title: '账单管理'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: '/billCheck1',
  //       name: 'billCheck1',
  //       meta: {
  //         title: '充值',
  //         icon: 'md-person'
  //       },
  //       component: () => import('@/view/bill/check1.vue')
  //     },
  //     {
  //       path: '/billCheck2',
  //       name: 'billCheck2',
  //       meta: {
  //         title: '提现',
  //         icon: 'md-person'
  //       },
  //       component: () => import('@/view/bill/check2.vue')
  //     }
  //   ]
  // },
  {
    path: '/wlManager',
    name: 'wlManager',
    meta: {
      icon: 'md-person',
      title: '物流管理'
    },
    component: Main,
    children: [
      {
        path: '/wlSending',
        name: 'wlSending',
        meta: {
          title: '待发货',
          icon: 'md-person'
        },
        component: () => import('@/view/wl/wlSending.vue')
      },
      {
        path: '/wlSend',
        name: 'wlSend',
        meta: {
          title: '已发货',
          icon: 'md-person'
        },
        component: () => import('@/view/wl/wlSend.vue')
      }
    ]
  },
  {
    path: '/productionManager',
    name: 'productionManager',
    meta: {
      icon: 'md-person',
      title: '生产管理'
    },
    component: Main,
    children: [
      {
        path: '/production',
        name: 'production',
        meta: {
          title: '生产中',
          icon: 'md-person'
        },
        component: () => import('@/view/production/production.vue')
      },
      {
        path: '/completed',
        name: 'completed',
        meta: {
          title: '生产完成',
          icon: 'md-person'
        },
        component: () => import('@/view/production/completed.vue')
      }
    ]
  },
  {
    path: '/lottoManager',
    name: 'lottoManager',
    meta: {
      icon: 'md-person',
      title: '抽奖管理'
    },
    component: Main,
    children: [
      {
        path: '/lottos',
        name: 'lottos',
        meta: {
          title: '抽奖商品',
          icon: 'md-person'
        },
        component: () => import('@/view/product/lotto.vue')
      }
    ]
  },
  {
    path: '/platformManager',
    name: 'platformManager',
    meta: {
      icon: 'md-person',
      title: '平台管理'
    },
    component: Main,
    children: [
      {
        path: '/platformOptions',
        name: 'platformOptions',
        meta: {
          title: '参数配置',
          icon: 'md-person'
        },
        component: () => import('@/view/platform/platform.vue')
      }
      // {
      //   path: '/compansationPlat',
      //   name: 'compansationPlat',
      //   meta: {
      //     title: '偿返计划',
      //     icon: 'md-person'
      //   },
      //   component: () => import('@/view/production/completed.vue')
      // }
    ]
  },
  {
    path: '/noticeManager',
    name: 'noticeManager',
    meta: {
      icon: 'md-person',
      title: '公告管理'
    },
    component: Main,
    children: [
      {
        path: '/notice',
        name: 'notice',
        meta: {
          title: '公告管理',
          icon: 'md-person'
        },
        component: () => import('@/view/notice/notice.vue')
      }
    ]
  },
  {
    path: '/rookieManager',
    name: 'rookieManager',
    meta: {
      icon: 'md-person',
      title: '新手锦囊'
    },
    component: Main,
    children: [
      {
        path: '/rookie',
        name: 'rookie',
        meta: {
          title: '新手锦囊',
          icon: 'md-person'
        },
        component: () => import('@/view/rookie/rookie.vue')
      }
    ]
  },
  {
    path: '/carouseManager',
    name: 'carouseManager',
    meta: {
      icon: 'md-person',
      title: '轮播图'
    },
    component: Main,
    children: [
      {
        path: '/carouse',
        name: 'carouse',
        meta: {
          title: '轮播图',
          icon: 'md-person'
        },
        component: () => import('@/view/carouse/carouse.vue')
      }
    ]
  },
]
