DROP TABLE IF EXISTS user;
CREATE TABLE user(
    uid INTEGER NOT NULL  , --用户ID
    username TEXT NOT NULL  , --用户名
    password TEXT NOT NULL  , --密码
    is_admin TEXT(1) NOT NULL  DEFAULT 0, --是否为管理员
    PRIMARY KEY (uid)
)  ; --用户表;

DROP TABLE IF EXISTS anime;
CREATE TABLE anime(
    aid INTEGER NOT NULL  , --动画ID
    title TEXT   , --动画标题（多语言）
    meta_db TEXT   , --元数据数据库
    meta_id INTEGER   , --元数据ID
    meta_update_time NUMERIC   , --元数据更新时间
    meta_title TEXT   , --元数据标题
    season TEXT   , --季度信息
    source TEXT   , --片源来源
    filter TEXT   , --种子下载过滤
    poster_url TEXT   , --海报链接
    poster_path TEXT   , --海报路径
    save_path TEXT   , --视频保存路径
    is_subscribe TEXT(1)   , --是否订阅
    update_time NUMERIC   , --更新时间
    PRIMARY KEY (aid)
)  ; --动画表

DROP TABLE IF EXISTS rss;
CREATE TABLE rss(
    rid INTEGER NOT NULL  , --RSS ID
    title TEXT NOT NULL  , --RSS标题
    name TEXT   , --RSS显示名称
    aid INTEGER   , --关联的AID
    filter TEXT   , --种子过滤
    url TEXT NOT NULL  , --RSS URL
    meta TEXT   , --RSS元数据
    source TEXT NOT NULL  , --RSS 来源/解析方法
    is_subscribe TEXT(1)   DEFAULT 0, --是否订阅
    PRIMARY KEY (rid)
)  ; --RSS表

DROP TABLE IF EXISTS torrent;
CREATE TABLE torrent(
    tid INTEGER NOT NULL  , --种子ID
    aid INTEGER   , --所属动画ID
    rid INTEGER NOT NULL  , --种子来源RSS ID
    title TEXT   , --种子名称
    homepage TEXT   , --种子主页
    url TEXT NOT NULL  , --种子URL
    content_length INTEGER   , --种子大小
    meta TEXT   , --种子元数据
    state INTEGER NOT NULL  DEFAULT -1, --状态：-6-种子重复，-5-剧集重复，-4-无法获取下载状态，-3-种子识别错误，-2-被过滤，-1-不下载，0-未下载，1：队列中，2：已重命名（正在下载），3：下载完成
    file_name TEXT   , --下载文件（夹）名
    hash TEXT   , --qBittorrent Hash值
    PRIMARY KEY (tid)
)  ; --种子表

DROP TABLE IF EXISTS episode;
CREATE TABLE episode(
    eid INTEGER   , --剧集ID
    aid INTEGER   , --所属动画ID
    tid INTEGER   , --来源种子ID
    rid INTEGER   , --来源RSS ID
    name TEXT   , --名称
    season INTEGER   , --季度
    ep TEXT    --集数
)  ; --剧集表

INSERT INTO USER (username, password, is_admin) VALUES ('admin', 'MajXVCD4MFYgX9MAJgLnpb85cGuxfWmIPoBnMT89Wik=', '1');
INSERT INTO USER (username, password, is_admin) VALUES ('guest', '2asWkOYoHOSMZxZ5C1QPG0I6TJxLaMHSyoHUVSh6DVY=', '0');