import { AlertCurEvent } from "../pages/alert/event/AlertCurEvent";
import { AlertHisEvent } from "../pages/alert/event/AlertHisEvent";
import { AlertRuleList } from "../pages/alert/rule";
import { AlertRuleGroup } from "../pages/alert/ruleGroup";
import { RuleTemplate } from "../pages/alert/tmpl";
import { RuleTemplateGroup } from "../pages/alert/tmplGroup";
import { Datasources } from "../pages/datasources";
import { DutyManage } from "../pages/duty";
import { Home } from "../pages/home";
import { UserRole } from "../pages/members/role";
import { User } from "../pages/members/user";
import { NoticeObjects } from "../pages/notice";
import { NoticeTemplate } from "../pages/notice/tmpl";
import { Silences } from "../pages/silence";
import { Login } from "../utils/Login";
import Error from "../utils/Error"
import { ComponentsContent } from '../components';
import { Tenants } from "../pages/tenant";
import { GrafanaDashboardComponent } from "../pages/dashboards/dashboard/iframe";
import { DashboardFolder } from "../pages/dashboards/folder";
import { AuditLog } from "../pages/audit";
import { SystemSettings } from "../pages/settings";
import { TenantDetail } from "../pages/tenant/detail";
import { AlertRule } from "../pages/alert/rule/create";
import { MonitorSSL } from "../pages/monitor/ssl";
import { CreateMonitorSSLRule } from "../pages/monitor/ssl/create";
import {Dashboards} from "../pages/dashboards/dashboard";
import {Subscribe} from "../pages/subscribe";
import {CreateSubscribeModel} from "../pages/subscribe/create";

// eslint-disable-next-line import/no-anonymous-default-export
export default [
    {
        path: '/',
        element: <ComponentsContent name="监控分析" c={<Home />} />,
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/ruleGroup',
        element: <ComponentsContent name="告警规则组" c={<AlertRuleGroup />} />,
    },
    {
        path: '/ruleGroup/:id/rule/list',
        element: <ComponentsContent name="告警规则" c={<AlertRuleList />} />
    },
    {
        path: '/ruleGroup/:id/rule/add',
        element: <ComponentsContent name="添加告警规则" c={<AlertRule type="add"/>} />
    },
    {
        path: '/ruleGroup/:id/rule/:ruleId/edit',
        element: <ComponentsContent name="编辑告警规则" c={<AlertRule type="edit"/>} />
    },
    {
        path: '/silenceRules',
        element: <ComponentsContent name="静默规则" c={<Silences />} />
    },
    {
        path: '/alertCurEvent',
        element: <ComponentsContent name="当前告警" c={<AlertCurEvent />} />
    },
    {
        path: '/alertHisEvent',
        element: <ComponentsContent name="历史告警" c={<AlertHisEvent />} />
    },
    {
        path: '/ruleTemplateGroup',
        element: <ComponentsContent name="规则模版组" c={<RuleTemplateGroup />} />,
    },
    {
        path: '/ruleTemplateGroup/:ruleGroupName/templates',
        element: <ComponentsContent name="告警模版" c={<RuleTemplate />} />
    },
    {
        path: '/noticeObjects',
        element: <ComponentsContent name="通知对象" c={<NoticeObjects />} />
    },
    {
        path: '/noticeTemplate',
        element: <ComponentsContent name="通知模版" c={<NoticeTemplate />} />
    },
    {
        path: '/dutyManage',
        element: <ComponentsContent name="值班日程" c={<DutyManage />} />
    },
    {
        path: '/user',
        element: <ComponentsContent name="用户管理" c={<User />} />
    },
    {
        path: '/userRole',
        element: <ComponentsContent name="角色管理" c={<UserRole />} />
    },
    {
        path: '/tenants',
        element: <ComponentsContent name="租户管理" c={<Tenants />} />
    },
    {
        path: '/tenants/detail/:id',
        element: <ComponentsContent name="租户" c={<TenantDetail/>} />
    },
    {
        path: '/datasource',
        element: <ComponentsContent name="数据源" c={<Datasources />} />
    },
    {
        path: '/folders',
        element: <ComponentsContent name="仪表盘目录" c={<DashboardFolder />} />
    },
    {
        path: '/folder/:id/list',
        element: <ComponentsContent name="仪表盘" c={<Dashboards />} />
    },
    {
        path: 'dashboard/f/:fid/g/:did/info',
        element: <ComponentsContent name="仪表盘" c={<GrafanaDashboardComponent />} />
    },
    {
        path: '/auditLog',
        element: <ComponentsContent name="日志审计" c={<AuditLog />} />
    },
    {
        path: '/settings',
        element: <ComponentsContent name="系统设置" c={<SystemSettings/>}/>
    },
    {
        path: '/monitor/ssl/list',
        element: <ComponentsContent name="证书监控" c={<MonitorSSL/>} />
    },
    {
        path: '/monitor/ssl/create',
        element: <ComponentsContent name="创建证书监控规则" c={<CreateMonitorSSLRule type="add"/>} />
    },
    {
        path: '/monitor/ssl/:id/edit',
        element: <ComponentsContent name="编辑证书监控规则" c={<CreateMonitorSSLRule type="edit"/>} />
    },
    {
        path: '/subscribes',
        element: <ComponentsContent name="告警订阅" c={<Subscribe />} />
    },
    {
        path: '/subscribe/create',
        element: <ComponentsContent name="添加订阅" c={<CreateSubscribeModel />} />
    },
    {
        path: '/*',
        element: <Error />
    }
]