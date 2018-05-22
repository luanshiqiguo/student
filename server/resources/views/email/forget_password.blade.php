<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body>
<div style="height: auto; width: 30%; margin-left: auto; margin-right: auto; padding: 20px; min-width: 500px;background-color: #f4f6f8;border-radius: 20px">
    <h3 style="text-align: left"> {{ $name }} 同学 :</h3>
    <p>您请求重新设置武汉理工大学计算机导论网站的登录密码，请点击下方链接重设密码。（若非本人操作，忽略本邮件即可）</p>
    <a style="text-decoration: none" href="{{ $url.'#/reset-password?stuId='.$stuId.'&token='.$token}}">
        <p>{{$url.'#/reset-password?stuId='.$stuId.'&token='.$token}}</p>
    </a>
    <p>如果无法直接打开链接，请尝试复制上方链接地址至浏览器地址栏中打开。</p>
    <h3 style="text-align: right"> 武汉理工大学计算机导论</h3>
</div>

<br>
</body>
</html>