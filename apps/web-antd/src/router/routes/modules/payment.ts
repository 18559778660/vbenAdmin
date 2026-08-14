import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const Placeholder = () => import('#/views/_shared/placeholder.vue');

/**
 * 业务菜单参考配置。
 * 当前侧边栏已改为走后端 GET /api/menu/all，本文件不再生成菜单。
 * 后续加业务页时，可对照这里的 name/path/文案，再写入后端 menus 种子。
 */
const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:settings',
      order: 10,
      title: $t('page.basicConfig.title'),
    },
    name: 'BasicConfig',
    path: '/basic-config',
    children: [
      {
        name: 'CardBinVerify',
        path: 'card-bin',
        component: Placeholder,
        meta: {
          icon: 'lucide:credit-card',
          title: $t('page.basicConfig.cardBin'),
        },
      },
      {
        name: 'CurrencyList',
        path: 'currency',
        component: Placeholder,
        meta: {
          icon: 'lucide:circle-dollar-sign',
          title: $t('page.basicConfig.currency'),
        },
      },
      {
        name: 'CountryList',
        path: 'country',
        component: Placeholder,
        meta: {
          icon: 'lucide:globe',
          title: $t('page.basicConfig.country'),
        },
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:handshake',
      order: 20,
      title: $t('page.merchant.title'),
    },
    name: 'Merchant',
    path: '/merchant',
    children: [
      {
        name: 'MerchantList',
        path: 'list',
        component: Placeholder,
        meta: {
          icon: 'lucide:users',
          title: $t('page.merchant.list'),
        },
      },
      {
        name: 'MerchantGroup',
        path: 'group',
        component: Placeholder,
        meta: {
          icon: 'lucide:folders',
          title: $t('page.merchant.group'),
        },
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:rocket',
      order: 30,
      title: $t('page.channel.title'),
    },
    name: 'Channel',
    path: '/channel',
    children: [
      {
        name: 'ChannelList',
        path: 'list',
        component: Placeholder,
        meta: {
          icon: 'lucide:list',
          title: $t('page.channel.list'),
        },
      },
      {
        name: 'ChannelAccount',
        path: 'account',
        component: Placeholder,
        meta: {
          icon: 'lucide:user-cog',
          title: $t('page.channel.account'),
        },
      },
      {
        name: 'ChannelGroup',
        path: 'group',
        component: Placeholder,
        meta: {
          icon: 'lucide:layers',
          title: $t('page.channel.group'),
        },
      },
      {
        name: 'ChannelAssign',
        path: 'assign',
        component: Placeholder,
        meta: {
          icon: 'lucide:share-2',
          title: $t('page.channel.assign'),
        },
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:wallet',
      order: 40,
      title: $t('page.paypal.title'),
    },
    name: 'Paypal',
    path: '/paypal',
    children: [
      {
        name: 'PaypalAccount',
        path: 'account',
        component: Placeholder,
        meta: {
          icon: 'lucide:wallet-cards',
          title: $t('page.paypal.account'),
        },
      },
      {
        name: 'PaypalOrder',
        path: 'order',
        component: Placeholder,
        meta: {
          icon: 'lucide:receipt',
          title: $t('page.paypal.order'),
        },
      },
      {
        name: 'PaypalRisk',
        path: 'risk',
        component: Placeholder,
        meta: {
          icon: 'lucide:shield',
          title: $t('page.paypal.risk'),
        },
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:bar-chart-3',
      order: 50,
      title: $t('page.tradeStats.title'),
    },
    name: 'TradeStats',
    path: '/trade-stats',
    children: [
      {
        name: 'TradeMerchantStats',
        path: 'merchant',
        component: Placeholder,
        meta: {
          icon: 'lucide:store',
          title: $t('page.tradeStats.merchant'),
        },
      },
      {
        name: 'TradePaymentStats',
        path: 'payment',
        component: Placeholder,
        meta: {
          icon: 'lucide:credit-card',
          title: $t('page.tradeStats.payment'),
        },
      },
      {
        name: 'TradeAccountStats',
        path: 'account',
        component: Placeholder,
        meta: {
          icon: 'lucide:user-round',
          title: $t('page.tradeStats.account'),
        },
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:chart-column',
      order: 60,
      title: $t('page.trade.title'),
    },
    name: 'Trade',
    path: '/trade',
    children: [
      {
        name: 'TradeOrderList',
        path: 'order',
        component: Placeholder,
        meta: {
          icon: 'lucide:list-ordered',
          title: $t('page.trade.order'),
        },
      },
      {
        name: 'TradeHoldList',
        path: 'hold',
        component: Placeholder,
        meta: {
          icon: 'lucide:hand',
          title: $t('page.trade.hold'),
        },
      },
      {
        name: 'TradeOrderLog',
        path: 'order-log',
        component: Placeholder,
        meta: {
          icon: 'lucide:file-clock',
          title: $t('page.trade.orderLog'),
        },
      },
      {
        name: 'TradeSiteBOrder',
        path: 'site-b-order',
        component: Placeholder,
        meta: {
          icon: 'lucide:shopping-bag',
          title: $t('page.trade.siteBOrder'),
        },
      },
      {
        name: 'TradeBatch',
        path: 'batch',
        component: Placeholder,
        meta: {
          icon: 'lucide:layers',
          title: $t('page.trade.batch'),
        },
      },
      {
        name: 'TradeRefundList',
        path: 'refund',
        component: Placeholder,
        meta: {
          icon: 'lucide:undo-2',
          title: $t('page.trade.refund'),
        },
      },
      {
        name: 'TradeShoplineRefund',
        path: 'shopline-refund',
        component: Placeholder,
        meta: {
          icon: 'lucide:store',
          title: $t('page.trade.shoplineRefund'),
        },
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:truck',
      order: 70,
      title: $t('page.logistics.title'),
    },
    name: 'Logistics',
    path: '/logistics',
    children: [
      {
        name: 'LogisticsOrder',
        path: 'order',
        component: Placeholder,
        meta: {
          icon: 'lucide:package',
          title: $t('page.logistics.order'),
        },
      },
      {
        name: 'LogisticsChannel',
        path: 'channel',
        component: Placeholder,
        meta: {
          icon: 'lucide:route',
          title: $t('page.logistics.channel'),
        },
      },
      {
        name: 'LogisticsTrack',
        path: 'track',
        component: Placeholder,
        meta: {
          icon: 'lucide:map-pinned',
          title: $t('page.logistics.track'),
        },
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:globe',
      order: 80,
      title: $t('page.site.title'),
    },
    name: 'Site',
    path: '/site',
    children: [
      {
        name: 'SiteAManage',
        path: 'site-a',
        component: Placeholder,
        meta: {
          icon: 'lucide:monitor',
          title: $t('page.site.siteA'),
        },
      },
      {
        name: 'SiteBManage',
        path: 'site-b',
        component: Placeholder,
        meta: {
          icon: 'lucide:monitor-smartphone',
          title: $t('page.site.siteB'),
        },
      },
      {
        name: 'StripeWordBank',
        path: 'stripe-wordbank',
        component: Placeholder,
        meta: {
          icon: 'lucide:book-text',
          title: $t('page.site.stripeWordBank'),
        },
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:shield-alert',
      order: 90,
      title: $t('page.risk.title'),
    },
    name: 'Risk',
    path: '/risk',
    children: [
      {
        name: 'RiskRule',
        path: 'rule',
        component: Placeholder,
        meta: {
          icon: 'lucide:scroll-text',
          title: $t('page.risk.rule'),
        },
      },
      {
        name: 'RiskBlacklist',
        path: 'blacklist',
        component: Placeholder,
        meta: {
          icon: 'lucide:ban',
          title: $t('page.risk.blacklist'),
        },
      },
      {
        name: 'RiskWhitelist',
        path: 'whitelist',
        component: Placeholder,
        meta: {
          icon: 'lucide:circle-check',
          title: $t('page.risk.whitelist'),
        },
      },
      {
        name: 'RiskRecord',
        path: 'record',
        component: Placeholder,
        meta: {
          icon: 'lucide:file-clock',
          title: $t('page.risk.record'),
        },
      },
      {
        name: 'RiskCardBinRule',
        path: 'card-bin-rule',
        component: Placeholder,
        meta: {
          icon: 'lucide:credit-card',
          title: $t('page.risk.cardBinRule'),
        },
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:mail',
      order: 100,
      title: $t('page.email.title'),
    },
    name: 'Email',
    path: '/email',
    children: [
      {
        name: 'EmailTemplate',
        path: 'template',
        component: Placeholder,
        meta: {
          icon: 'lucide:file-text',
          title: $t('page.email.template'),
        },
      },
      {
        name: 'EmailRecord',
        path: 'record',
        component: Placeholder,
        meta: {
          icon: 'lucide:send',
          title: $t('page.email.record'),
        },
      },
      {
        name: 'EmailConfig',
        path: 'config',
        component: Placeholder,
        meta: {
          icon: 'lucide:settings-2',
          title: $t('page.email.config'),
        },
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:key',
      order: 110,
      title: $t('page.permission.title'),
    },
    name: 'Permission',
    path: '/permission',
    children: [
      {
        name: 'PermissionUser',
        path: 'user',
        component: Placeholder,
        meta: {
          icon: 'lucide:user',
          title: $t('page.permission.user'),
        },
      },
      {
        name: 'PermissionRole',
        path: 'role',
        component: Placeholder,
        meta: {
          icon: 'lucide:users-round',
          title: $t('page.permission.role'),
        },
      },
      {
        name: 'PermissionMenu',
        path: 'menu',
        component: Placeholder,
        meta: {
          icon: 'lucide:menu',
          title: $t('page.permission.menu'),
        },
      },
      {
        name: 'PermissionOperationLog',
        path: 'operation-log',
        component: Placeholder,
        meta: {
          icon: 'lucide:clipboard-list',
          title: $t('page.permission.operationLog'),
        },
      },
      {
        name: 'PermissionLoginLog',
        path: 'login-log',
        component: Placeholder,
        meta: {
          icon: 'lucide:log-in',
          title: $t('page.permission.loginLog'),
        },
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:headset',
      order: 120,
      title: $t('page.csOrder.title'),
    },
    name: 'CsOrder',
    path: '/cs-order',
    children: [
      {
        name: 'CsTicketList',
        path: 'ticket',
        component: Placeholder,
        meta: {
          icon: 'lucide:ticket',
          title: $t('page.csOrder.ticket'),
        },
      },
      {
        name: 'CsOrderRemark',
        path: 'remark',
        component: Placeholder,
        meta: {
          icon: 'lucide:message-square-text',
          title: $t('page.csOrder.remark'),
        },
      },
      {
        name: 'CsHandleRecord',
        path: 'handle-record',
        component: Placeholder,
        meta: {
          icon: 'lucide:history',
          title: $t('page.csOrder.handleRecord'),
        },
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:folder',
      order: 130,
      title: $t('page.quickAction.title'),
    },
    name: 'QuickAction',
    path: '/quick-action',
    children: [
      {
        name: 'QuickAddMerchant',
        path: 'add-merchant',
        component: Placeholder,
        meta: {
          icon: 'lucide:user-plus',
          title: $t('page.quickAction.addMerchant'),
        },
      },
      {
        name: 'QuickAddChannel',
        path: 'add-channel',
        component: Placeholder,
        meta: {
          icon: 'lucide:plus-circle',
          title: $t('page.quickAction.addChannel'),
        },
      },
      {
        name: 'QuickViewException',
        path: 'view-exception',
        component: Placeholder,
        meta: {
          icon: 'lucide:search',
          title: $t('page.quickAction.viewException'),
        },
      },
      {
        name: 'QuickExportToday',
        path: 'export-today',
        component: Placeholder,
        meta: {
          icon: 'lucide:download',
          title: $t('page.quickAction.exportToday'),
        },
      },
    ],
  },
];

export default routes;
