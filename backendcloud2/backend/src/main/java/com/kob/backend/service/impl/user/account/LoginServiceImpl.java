package com.kob.backend.service.impl.user.account;

import com.kob.backend.pojo.User;
import com.kob.backend.service.impl.utils.UserDetailsImpl;
import com.kob.backend.service.user.account.LoginService;
import com.kob.backend.utils.JwtUtil;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Override
    public Map<String, String> getToken(String username, String password) {


//        UsernamePasswordAuthenticationToken 是 Spring Security 中用于封装用户名密码认证信息的一个类，它实现了 Authentication 接口，用于表示一个认证请求。
//        在构造时，还可以使用其他构造方法为认证请求设置授权信息、权限列表等

//        在 Spring Security 中，通过 AuthenticationManager 对象对认证请求进行认证，
//        认证成功后会生成一个 Authentication 对象，并将其存储在 SecurityContextHolder 中，
//        用于表示当前的认证信息。在应用程序中，
//        可以通过 SecurityContextHolder 对象获取当前的认证信息

        // 将username 和 Password 加密
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(username, password);

//      对认证信息进行认证
        Authentication authenticate = authenticationManager.authenticate(authenticationToken); // 登陆失败，会自动处理
//       当前用户的信息
        UserDetailsImpl loginUser = (UserDetailsImpl) authenticate.getPrincipal();
        User user = loginUser.getUser();

        String jwt = JwtUtil.createJWT(user.getId().toString());

        Map<String, String> map = new HashMap<>();
        map.put("error_message", "success");
        map.put("token", jwt);

        return map;
    }
}
