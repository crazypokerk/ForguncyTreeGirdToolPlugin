using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using GrapeCity.Forguncy.Log;
using Microsoft.Extensions.Logging;

namespace TreeGridToolPlugin.Server
{
    internal class TreeGridToolPluginMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<TreeGridToolPluginMiddleware> _logger;
        public TreeGridToolPluginMiddleware(RequestDelegate next, ILogger<TreeGridToolPluginMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                if (context.Request.Path.Value == "/TreeGridToolPluginMiddleware")
                {
                    context.Response.ContentType = "text/plain;charset=UTF-8";
                    await context.Response.WriteAsync("自定义中间件测试成功");
                    return;
                }
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "树形工具插件中间件处理请求时发生错误");
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await context.Response.WriteAsync("服务器内部错误");
            }
        }
    }
}
