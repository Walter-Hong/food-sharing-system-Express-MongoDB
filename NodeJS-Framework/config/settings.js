/**
 * @author walterhong
 *
 * 项目配置参数，目前仅有数据库配置
 */

var settings = {
        //开发模式下的数据库配置
        development: {
            database: {
                host: 'localhost',
                user: 'root',
                pass: 'root',
                name: 'test2'
            }
        },
        //测试环境数据库
        test: {
            database: {
                host: 'localhost',
                user: 'root',
                pass: 'root',
                name: 'test2'
            }
        }
    }
;


var env = process.env.NODE_ENV
if (!env) {
    env = 'development';
}
module.exports = settings[env];
