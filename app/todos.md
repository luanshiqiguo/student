# 问题
- app图标 (finish)
- 按两次退出 (finish)
- android的back键和导航进行绑定 (finish)
- 成就页面显示 (finish)
- task的状态显示和控制 (finish)
- 图标的调整 (finish)
- 错误处理 (finish)
- 选择题乱序功能 
- 下拉刷新功能 (finish)
- 本地数据的持久化存储
- 自动登录功能
- 升级功能
- 启动页面

# 使用的api接口
### /sign-in
### /sign-out
用户登录退出

### /change-password
用户密码修改

### /feedback
用户反馈

### /get-task-list-ex
在两个地方使用到，
- 1）在开始加载页面，同时加载4中task 
- 2）在下拉刷新时，请求单种task数据


### /get-task-content
在答题或者查看任务题目时候会获取，只用于课前预习，课后作业，实验练习的选择题类型

### /add-task-report
提交task完成的task，有两个地方使用
- 1）选择题提交
- 2）简答题（总结）
