package com.kob.bootrunningsystem.service.Impl;

import com.kob.bootrunningsystem.service.BotRunningService;
import com.kob.bootrunningsystem.service.Impl.utils.BotPool;
import org.springframework.stereotype.Service;

@Service
public class BotRunningServiceImpl implements BotRunningService {
    public final static BotPool botPool= new BotPool();

    @Override
    public String addBot(Integer userId, String botCode, String input) {
        System.out.println("add bot: " +  userId + " " + botCode + " " + input);
        botPool.addBot(userId, botCode, input);
        return "add not success";
    }
}
