scaled <- jsonlite::fromJSON("~/Desktop/projects/epiviz/epiviz-chart/performance/results/scaled.log")

fields <- c("domContentLoadedEventEnd", "loadEventEnd", "responseEnd")
datapoints <- names(scaled)

httpTime <- sapply(names(scaled), function(dp) {
  mean(scaled[[dp]][['total_http_time']])
})

httpTime_sd <- sapply(names(scaled), function(dp) {
  sd(scaled[[dp]][['total_http_time']])
})

drawTime <- sapply(names(scaled), function(dp) {
  mean(scaled[[dp]][['total_draw_time']])
})

drawTime_sd <- sapply(names(scaled), function(dp) {
  sd(scaled[[dp]][['total_draw_time']])
})

latencyTime <- sapply(names(scaled), function(dp) {
  mean(scaled[[dp]][['network_latency']])
})

latencyTime_sd <- sapply(names(scaled), function(dp) {
  sd(scaled[[dp]][['network_latency']])
})


scaled_formatted <- data.frame(grange = datapoints,
                               httpTime = httpTime,
                               httpTime_sd = httpTime_sd,
                               drawTime = drawTime,
                               drawTime_sd = drawTime_sd,
                               latencyTime = latencyTime,
                               latencyTime_sd = latencyTime_sd,
                               stringsAsFactors = FALSE)

unscaled <- jsonlite::fromJSON("~/Desktop/projects/epiviz/epiviz-chart/performance/results/unscaled.log")
datapoints <- names(unscaled)

httpTime <- sapply(names(unscaled), function(dp) {
  mean(unscaled[[dp]][['total_http_time']])
})

httpTime_sd <- sapply(names(unscaled), function(dp) {
  sd(unscaled[[dp]][['total_http_time']])
})

drawTime <- sapply(names(unscaled), function(dp) {
  mean(unscaled[[dp]][['total_draw_time']])
})

drawTime_sd <- sapply(names(unscaled), function(dp) {
  sd(unscaled[[dp]][['total_draw_time']])
})

latencyTime <- sapply(names(unscaled), function(dp) {
  mean(unscaled[[dp]][['network_latency']])
})

latencyTime_sd <- sapply(names(unscaled), function(dp) {
  sd(unscaled[[dp]][['network_latency']])
})

unscaled_formatted <- data.frame(grange = datapoints,
                                 httpTime = httpTime,
                                 httpTime_sd = httpTime_sd,
                                 drawTime = drawTime,
                                 drawTime_sd = drawTime_sd,
                                 latencyTime = latencyTime,
                                 latencyTime_sd = latencyTime_sd,
                                 stringsAsFactors = FALSE)

library(ggplot2)
library(gridExtra)

drawTimePlot <- ggplot(data=NULL, aes(reorder(grange, drawTime), group = 2)) +
  geom_line(data = unscaled_formatted, aes(y = drawTime, colour = "unscaled")) +
  geom_line(data = scaled_formatted, aes(y = drawTime, colour = "summarized")) +
  ylab("draw time (ms)") +
  xlab("genomic range (bp)") +
  geom_errorbar(data = unscaled_formatted, aes(ymin=drawTime-drawTime_sd, ymax=drawTime+drawTime_sd, colour = "unscaled"), width=.2) +
  geom_errorbar(data = scaled_formatted, aes(ymin=drawTime-drawTime_sd, ymax=drawTime+drawTime_sd, colour = "summarized"), width=.2) +
  theme(legend.position="top")

httpTimePlot <- ggplot(data=NULL, aes(reorder(grange, drawTime), group =1)) +
  geom_line(data = unscaled_formatted, aes(y = httpTime, colour = "unscaled")) +
  geom_line(data = scaled_formatted, aes(y = httpTime, colour = "summarized")) +
  ylab("http response time (ms)") +
  xlab("genomic range (bp)") +
  geom_errorbar(data = unscaled_formatted, aes(ymin=httpTime-httpTime_sd, ymax=httpTime+httpTime_sd, colour = "unscaled"), width=.2) +
  geom_errorbar(data = scaled_formatted, aes(ymin=httpTime-httpTime_sd, ymax=httpTime+httpTime_sd, colour = "summarized"), width=.2) +
  theme(legend.position="top")

latencyTimePlot <- ggplot(data=NULL, aes(reorder(grange, drawTime), group = 2)) +
  geom_line(data = unscaled_formatted, aes(y = latencyTime, colour = "unscaled")) +
  geom_line(data = scaled_formatted, aes(y = latencyTime, colour = "summarized")) +
  ylab("network latency (ms)") +
  xlab("genomic range (bp)") +
  geom_errorbar(data = unscaled_formatted, aes(ymin=latencyTime-latencyTime_sd, ymax=latencyTime+latencyTime_sd, colour = "unscaled"), width=.2) +
  geom_errorbar(data = scaled_formatted, aes(ymin=latencyTime-latencyTime_sd, ymax=latencyTime+latencyTime_sd, colour = "summarized"), width=.2) +
  theme(legend.position="top")

grid.arrange(drawTimePlot, httpTimePlot, latencyTimePlot, nrow = 1)

