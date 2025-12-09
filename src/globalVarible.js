export const gv = {
  adapt: {}, // 适配专用网站方法
  tools: {}, // 内部工具
  utils: {}, // 外部方法
  config: {
    proxyOpen: false, // 是否允许开启代理
    randomReturn: undefined, // 随机数值固定
    randomFixed: false, // 固定日期与随机数，文件：@/config/dateAndRandom.json
    // 强制setInterval的时间设置，如设置的足够大让执行函数不运行，其中：undefined表示通过框架拦截并计算运行时间，0表示不拦截且使用原时间
    timeInterval: undefined,
    timeTimeout: undefined, // 与timeInterval功能类似，区别是控制setTimeout
    isNode: typeof window === 'undefined', // 标记是否是node环境初始化得到的sdenv
    envType: 'browser', // 执行环境类型，node或者browser，初始化时赋予
    // start window proxy
    // 控制window返回undefined的属性名集合
    windowGetterUndefinedKeys: ["_top","_parent","_length","_globalObject", "_sdGlobalObject","_globalProxy","_registeredHandlers","_eventHandlers","_resourceLoader","_document","_origin","_sessionHistory","_virtualConsole","_runScripts","_frameElement","_pretendToBeVisual","_storageQuota","_commonForOrigin","_currentOriginData","_localStorage","_sessionStorage","_selection","_customElementRegistry","loadTextSync"],
    // 控制window返回not defined报错的的属性名集合
    windowGetterErrorKeys: ['process'],
    // 控制window返回自身的属性名集合
    windowGetterWinKeys: ['window', 'top', 'self', 'frames', 'globalThis'],
    // end window proxy
  },
  memory: {
    runinfo: { // 程序运行时间节点
      start: new Date().getTime(), // 代码开始运行
      isDied: false, // 窗口生命是否已经结束
    },
    timeout: null, // 存放处理setTimeout/setInterval的类
    SdenvExtend: null, // node环境缓存sdenv-extend插件，用于浏览器环境使用
  },
  cache: {
    dynamicCode: [], // 缓存动态生成代码
    runloop: {}, // 缓存循环代码运行时
    /*
      缓存循环执行顺序
      sdenv.cache.runsArr
        .map((it, num) => ({idx: it.idx, num, ...it.val}))
        .reduce((ans, it) => (
          ans[it.idx] === undefined ? ans[it.idx] = [it] : ans[it.idx].push(it), ans
        ), {})
     */
    runsArr: [],
    runsObj: [], // 缓存循环递归树
    runtime: {}, // 存放运行时数据的代理
    monitor: {}, // 监控变量对象
    timeoutIdx: 0, // timeout编号，初始化时值递增
    intervalIdx: 0, // interval编号，初始化时值递增
  }, // 存储缓存数据
  datas: {
    dateAndRandom: {}, // 随机数相关数据
  },
}
