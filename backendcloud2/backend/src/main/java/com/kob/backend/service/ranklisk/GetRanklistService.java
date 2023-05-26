package com.kob.backend.service.ranklisk;

import com.alibaba.fastjson.JSONObject;

public interface GetRanklistService {
    JSONObject getList(Integer page);
}
