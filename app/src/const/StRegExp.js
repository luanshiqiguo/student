/**
 * Created by abing on 2017/4/27.
 */

export const regExp = /([\ud800-\udbff][\u0000-\uffff])/g;  //代码过滤掉4个字节的字符(过滤emoji)

