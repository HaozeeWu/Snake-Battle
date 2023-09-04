package com.kob.bootrunningsystem.service.Impl.utils;

import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class BotPool extends Thread{

    private final static ReentrantLock lock = new ReentrantLock();
    private final Condition condition = lock.newCondition(); // 条件变量
    private final Queue<Bot> bots = new LinkedList<>();

    public void addBot(Integer userId, String botCode, String input) {
        lock.lock();
        try {
            bots.add(new Bot(userId, botCode, input));
            condition.signalAll(); // 另外一个线程执行到这里，唤醒那个睡住的线程（因为只有一个线程，所以signalall唤醒全部是可以的）
        } finally {
            lock.unlock();
        }
    }
    private void consume(Bot bot) {
        Consumer consumer = new Consumer();
        consumer.startTimeout(2000, bot);
    }


    @Override
    public void run() {
        while (true) {
             lock.lock();
             if (bots.isEmpty()) {
                 try {
                     condition.await(); // 如果消息队列为空，则在这里“睡住”，睡住的时候锁会释放
                 } catch (InterruptedException e) {
                     e.printStackTrace();
                     lock.unlock();
                     break;
                 }
             } else {
                Bot bot = bots.remove();
                lock.unlock();
                consume(bot);  // 比较耗时，可能会执行几秒钟

             }
        }
    }
}
