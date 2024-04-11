const lang = {
    attr: '简',
    msg_err: '发生错误，请重试',
    msg_err_reload: '发生错误，请刷新重试',
    msg_err_not_admin: '权限不足',
    msg_click_to_copy: '点击复制',
    msg_click_to_edit: '点击编辑',
    msg_copy_success: '已添加到剪贴板',
    msg_click_to_open_in_blank: '新标签页中打开',
    confirm: '确定',
    cancel: '取消',
    save: '保存',
    reset: '重置',
    delete: '删除',
    header: {
        home: '首页',
        anime: '动画',
        rss: 'RSS',
        setting: '设置',
        logout: '登出'
    },
    home: {
        info_anime_title: '动画总数',
        info_subscribed_title: '订阅中的RSS',
        info_new_today: '今日新增种子'
    },
    login: {
        login: '登录',
        username: '用户名',
        password: '密码',
        msg_need_username: '请输入用户名',
        msg_need_password: '请输入密码',
    },
    rss: {
        title: 'RSS标题',
        name: '名称',
        subscribe: '订阅',
        url: 'URL',
        source: '来源',
        filter: '过滤',
        source_list: {
            mikan: '蜜柑计划'
        },
        type: '类型',
        type_list: {
            anime: '动画',
            subtitle: '字幕组',
            other: '其他'
        },
        season: '季度',
        season_prefix: '第',
        season_suffix: '季',
        season_list: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
        operation: '操作',
        add: '添加',
        edit: '编辑',
        delete: '删除RSS',
        rss_url: 'RSS链接',
        msg_empty: '点击[+ 添加]开始订阅RSS',
        msg_select: '请选择',
        msg_click_to_toggle: '点击切换订阅',
        msg_click_to_scan: '点击扫描RSS',
        msg_add_rss_success: 'RSS添加成功',
        msg_update_rss_success: 'RSS更新成功',
        msg_update_subscribe_success: '订阅状态更新成功',
        msg_scan_finished: 'RSS扫描完成',
        msg_delete_confirm: '确定删除当前RSS？',
        msg_delete_confirm_content: '此操作仅会删除<b>RSS订阅</b>，<b>不会</b>删除种子数据及已下载文件',
        msg_delete_success: '删除RSS成功'
    },
    anime: {
        name: '动画名称',
        torrent_title: '种子标题',
        save_path: '下载目录',
        torrent_url: '种子URL',
        homepage: '种子首页',
        state: '状态',
        toggle: '切换',
        ep: '剧集',
        ep_prefix: '第',
        ep_suffix: '话',
        ep_state: '剧集状态',
        refresh_poster: '更新海报',
        msg_ep_state_wait: '等待下载',
        msg_ep_state_queue: '队列中',
        msg_ep_state_download: '正在下载',
        msg_ep_state_finish: '下载完成',
        msg_ep_state_operate: '未下载',
        msg_ep_state_filtered: '被滤除',
        msg_ep_state_same: '剧集重复',
        msg_ep_state_unknown: '无法获取状态',
        msg_ep_state_torrent_err: '种子识别错误',
        msg_ep_state_same_torrent: '重复种子',
        msg_ep_state_error: '异常',
        msg_torrent_active: '下载使用的是该种子',
        msg_click_to_toggle: '点击切换为该种子',
        msg_toggle_confirm: '是否确定切换种子？',
        msg_toggle_confirm_blod: '该操作将删除已下载的资源！',
        msg_toggle_success: '种子切换完成',
        msg_refresh_poster_success: '海报更新完成',
        msg_refresh_poster_error: '海报更新失败'
    },
    setting: {
        port: '端口',
        admin_username: '管理员用户名',
        admin_password: '管理员密码',
        admin_password_repeat: '确认密码',
        qb_host: '地址',
        qb_username: '用户名',
        qb_password: '密码',
        ca_key: '私钥文件(key)',
        ca_cert: '证书文件(crt)',
        subscribe: '是否默认订阅',
        yes: '是',
        no: '否',
        msg_server_warning: '需至少开启一个服务器',
        jobs: {
            scan_rss: 'RSS扫描频率'
        },
        alert_server: '服务器设置',
        alert_admin: '管理员账户设置',
        alert_qb: 'qBittorrent设置',
        alert_download : '下载设置',
        alert_rss : 'RSS设置',
        alert_jobs: '任务设置',
        alert_jobs_sub: '任务执行频率设置请填写Cron表达式',
        msg_cron_error: 'Cron表达式有误',
        msg_error_empty_username: '请输入用户名',
        msg_error_empty_password: '请输入密码',
        msg_password_repeat_error: '两次输入的密码不一致',
        msg_save_success: '设置保存成功',
    }
}

export default lang