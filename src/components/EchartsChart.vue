<template>
  <!-- 必须设置宽高，否则图表无法显示 -->
  <div
    ref="chartRef"
    class="echarts-container"
    :style="{ width, height }"
  ></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
// 只引入 ECharts 核心模块 + 需要的图表/组件
import * as echarts from "echarts/core";
// 引入图表类型（按需选，比如折线图、柱状图）
import { LineChart, BarChart, PieChart } from "echarts/charts";
// 引入组件（按需选，比如标题、提示框、图例）
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
// 引入渲染器（必须）
import { CanvasRenderer } from "echarts/renderers";

// 注册需要的模块
echarts.use([
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer,
]);

// Props 定义
const props = defineProps({
  // 图表配置项
  option: {
    type: Object,
    required: true,
  },
  // 宽度（默认100%）
  width: {
    type: String,
    default: "100%",
  },
  // 高度（默认400px）
  height: {
    type: String,
    default: "400px",
  },
});

// 图表实例引用
const chartRef = ref<HTMLDivElement | null>(null);
// 图表实例
let chartInstance: echarts.ECharts | null = null;

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;
  // 初始化实例
  chartInstance = echarts.init(chartRef.value);
  // 设置配置项
  chartInstance.setOption(props.option);
  // 监听窗口大小变化，自适应
  window.addEventListener("resize", () => {
    chartInstance?.resize();
  });
};

// 监听配置项变化，更新图表
watch(
  () => props.option,
  (newOption) => {
    chartInstance?.setOption(newOption);
  },
  { deep: true }, // 深度监听对象变化
);

// 生命周期：挂载时初始化
onMounted(() => {
  initChart();
});

// 生命周期：卸载时销毁实例（防止内存泄漏）
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  // 移除 resize 监听
  window.removeEventListener("resize", () => {
    chartInstance?.resize();
  });
});
</script>

<style scoped>
.echarts-container {
  display: block;
}
</style>
