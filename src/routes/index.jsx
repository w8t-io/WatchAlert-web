import { AlertCurEvent } from "../pages/alert/event/AlertCurEvent";
import { AlertHisEvent } from "../pages/alert/event/AlertHisEvent";
import { AlertRules } from "../pages/alert/rule";
import { AlertRuleGroup } from "../pages/alert/ruleGroup";
import RuleTemplate from "../pages/alert/tmpl";
import RuleTemplateGroup from "../pages/alert/tmplGroup";
import { Datasources } from "../pages/datasources";
import { DutyManage } from "../pages/duty";
import { Home } from "../pages/home";
import UserRole from "../pages/members/role";
import User from "../pages/members/user";
import { NoticeObjects } from "../pages/notice";
import NoticeTemplate from "../pages/notice/tmpl";
import { Silences } from "../pages/silence";
import { Login } from "../utils/Login";
import Error from "../utils/Error"
import { ComponentsContent } from '../components';
import { Tenants } from "../pages/tenant";

// eslint-disable-next-line import/no-anonymous-default-export
export default [
    {
        path: '/',
        element: <ComponentsContent name="仪表盘" c={<Home />} />,
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/alertRuleGroup',
        element: <ComponentsContent name="告警规则组" c={<AlertRuleGroup />} />,
    },
    {
        path: '/alertRuleGroup/:id/rules',
        element: <ComponentsContent name="告警规则" c={<AlertRules />} />
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
        path: '/datasource',
        element: <ComponentsContent name="数据源" c={<Datasources />} />
    },
    {
        path: '/*',
        element: <Error />
    }
]