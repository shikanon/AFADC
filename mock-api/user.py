from flask import Flask, request, jsonify
import jwt
import datetime
import uuid
from functools import wraps
from flask_cors import CORS  # 导入CORS扩展

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # 用于JWT加密的密钥

# 配置允许所有地址跨域访问
CORS(app, resources={r"/*": {"origins": "*"}})

# 模拟数据库 - 包含初始测试数据
mock_db = {
    'users': [
        # 初始测试用户1
        {
            'id': 1,
            'username': 'org1_admin',
            'display_name': '张三',
            'email': 'admin@example.com',
            'password': 'password123',  # 明文存储方便测试
            'phone': '13800138000',
            'role': 'admin',
            'organization_id': 1,
            'is_active': True,
            'created_at': '2024-01-15T08:30:00Z'
        },
        # 初始测试用户2
        {
            'id': 2,
            'username': 'org2_user',
            'display_name': '李四',
            'email': 'user@test.com',
            'password': 'test123456',
            'phone': None,
            'role': 'user',
            'organization_id': 2,
            'is_active': True,
            'created_at': '2024-02-20T14:15:00Z'
        }
    ],
    'organizations': [
        # 初始测试组织1
        {
            'id': 1,
            'name': '示例科技有限公司',
            'created_at': '2024-01-15T08:30:00Z'
        },
        # 初始测试组织2
        {
            'id': 2,
            'name': '测试集团',
            'created_at': '2024-02-20T14:15:00Z'
        }
    ]
}

# 生成JWT Token
def generate_token(user_id):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

# Token验证装饰器
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # 从请求头获取token
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            # 验证token
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = payload['sub']
            current_user = next((user for user in mock_db['users'] if user['id'] == current_user_id), None)
            
            if not current_user:
                return jsonify({'message': 'Invalid token!'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401
            
        return f(current_user, *args, **kwargs)
    
    return decorated

# 1. 用户注册接口
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # 验证必填字段
    if not data.get('email'):
        return jsonify({'message': '邮箱不能为空'}), 400
    if not data.get('password') or len(data.get('password')) < 6:
        return jsonify({'message': '密码少于6位'}), 400
    if not data.get('organization_name') or len(data.get('organization_name')) < 2:
        return jsonify({'message': '组织名称为空或长度不足'}), 400
    
    # 检查邮箱是否已注册
    if any(user['email'] == data.get('email') for user in mock_db['users']):
        return jsonify({'message': '邮箱已被注册'}), 400
    
    # 创建组织
    org_id = len(mock_db['organizations']) + 1
    organization = {
        'id': org_id,
        'name': data.get('organization_name'),
        'created_at': datetime.datetime.utcnow().isoformat() + 'Z'
    }
    mock_db['organizations'].append(organization)
    
    # 创建用户
    user_id = len(mock_db['users']) + 1
    display_name = data.get('display_name', data.get('email').split('@')[0])
    user = {
        'id': user_id,
        'username': f'org{org_id}_admin',
        'display_name': display_name,
        'email': data.get('email'),
        'password': data.get('password'),
        'phone': None,
        'role': 'admin',
        'organization_id': org_id,
        'is_active': True,
        'created_at': datetime.datetime.utcnow().isoformat() + 'Z'
    }
    mock_db['users'].append(user)
    
    # 生成token
    token = generate_token(user_id)
    
    # 返回响应（不包含密码）
    user_response = {k: v for k, v in user.items() if k != 'password'}
    return jsonify({'token': token, 'user': user_response}), 200

# 2. 用户登录接口
@app.route('/api/auth/login', methods=['POST'])
def login():
    # 获取表单数据
    username = request.form.get('username')
    password = request.form.get('password')
    
    if not username:
        return jsonify({'message': '账号不能为空'}), 400
    
    # 查找用户（支持邮箱、用户名登录）
    user = next(
        (user for user in mock_db['users'] 
         if user['email'] == username or user['username'] == username or user['phone'] == username), 
        None
    )
    
    if not user or user['password'] != password:
        return jsonify({'message': '用户名或密码错误'}), 400
    
    # 生成token
    token = generate_token(user['id'])
    
    # 返回响应（不包含密码）
    user_response = {k: v for k, v in user.items() if k != 'password'}
    return jsonify({'token': token, 'user': user_response}), 200

# 3. 获取当前用户信息接口
@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    # 返回用户信息（不包含密码）
    user_response = {k: v for k, v in current_user.items() if k != 'password'}
    return jsonify(user_response), 200

# 4. 获取所有用户列表（调试接口）
@app.route('/api/users', methods=['GET'])
@token_required
def get_all_users(current_user):
    # 仅管理员可查看
    if current_user['role'] != 'admin':
        return jsonify({'message': '权限不足'}), 403
    
    # 过滤密码字段
    users = [{k: v for k, v in user.items() if k != 'password'} for user in mock_db['users']]
    return jsonify(users), 200

# 5. 获取组织列表（调试接口）
@app.route('/api/organizations', methods=['GET'])
@token_required
def get_organizations(current_user):
    return jsonify(mock_db['organizations']), 200

if __name__ == '__main__':
    app.run(debug=True)