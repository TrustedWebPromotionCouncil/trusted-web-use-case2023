package logger

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type header struct {
	Authorization string `header:"authorization"`
	XAmznTraceId  string `header:"X-Amzn-Trace-Id"`
}

const (
	formatSubject       = "\x1b[01;36m[Gin Request] %s %s\x1b[0m"
	formatStatusSucess  = "\x1b[46m%d\x1b[0m"
	formatStatusWarning = "\x1b[43m%d\x1b[0m"
	formatStatusError   = "\x1b[41m%d\x1b[0m"
)

func statusFormat(status int) string {
	if status >= 200 && status < 300 {
		return formatStatusSucess
	} else if status >= 300 && status < 400 {
		return formatStatusWarning
	} else if status >= 400 {
		return formatStatusError
	} else {
		return formatStatusWarning
	}
}

func (p *LoggerProvider) LoggingRequest(logger *zap.Logger, env Env, excludePaths []string) gin.HandlerFunc {
	if env == EnvDevelopment {
		return func(c *gin.Context) {
			start := time.Now()

			if existsString(excludePaths, c.Request.URL.Path) {
				return
			}

			c.Next()

			end := time.Now()
			latency := end.Sub(start)
			logger.Info(
				fmt.Sprintf("%s %s %s",
					fmt.Sprintf(formatSubject, c.Request.Method, c.Request.URL.Path),
					fmt.Sprintf(statusFormat(c.Writer.Status()), c.Writer.Status()),
					latency,
				),
			)
		}
	} else {
		return func(c *gin.Context) {
			start := time.Now()

			if existsString(excludePaths, c.Request.URL.Path) {
				return
			}

			var header header
			if err := c.ShouldBindHeader(&header); err != nil {
				c.Status(http.StatusBadRequest)
				return
			}

			c.Next()

			end := time.Now()
			latency := end.Sub(start)
			logger.Info("",
				zap.Int("status", c.Writer.Status()),
				zap.Array("header", zapcore.ArrayMarshalerFunc(func(inner zapcore.ArrayEncoder) error {
					for name, headers := range c.Request.Header {
						inner.AppendObject(zapcore.ObjectMarshalerFunc(func(innerObj zapcore.ObjectEncoder) error {
							innerObj.AddArray(name, zapcore.ArrayMarshalerFunc(func(innerHeaderArray zapcore.ArrayEncoder) error {
								for _, header := range headers {
									innerHeaderArray.AppendString(header)
								}
								return nil
							}))
							return nil
						}))
					}
					return nil
				})),
				zap.String("X-Amzn-Trace-Id", header.XAmznTraceId),
				zap.String("method", c.Request.Method),
				zap.String("path", c.Request.URL.Path),
				zap.String("query", c.Request.URL.RawQuery),
				zap.Array("params", zapcore.ArrayMarshalerFunc(func(inner zapcore.ArrayEncoder) error {
					for _, param := range c.Params {
						inner.AppendObject(zapcore.ObjectMarshalerFunc(func(innerObj zapcore.ObjectEncoder) error {
							innerObj.AddString(param.Key, param.Value)
							return nil
						}))
					}
					return nil
				})),
				zap.String("method", c.Request.Method),
				zap.String("ip", c.ClientIP()),
				zap.String("user-agent", c.Request.UserAgent()),
				zap.Duration("latency", latency),
			)
		}
	}
}
