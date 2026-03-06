<template>
  <div class="main-container">
    <div class="header">
      <h1>工单管理系统</h1>
      <div class="user-info">
        <span>当前用户：{{ userStore.username }}</span>
        <el-tag :type="userStore.isAdmin ? 'danger' : 'info'" size="small">
          {{ userStore.isAdmin ? "管理员" : "普通用户" }}
        </el-tag>
        <el-button type="primary" size="small" @click="handleLogout"
          >退出登录</el-button
        >
      </div>
    </div>

    <div class="content">
      <div class="table-section">
        <h2>工单列表</h2>
        <el-table :data="workOrders" border stripe style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="project" label="Project" min-width="180" />
          <el-table-column prop="overtime" label="Overtime" width="100">
            <template #default="{ row }">
              <el-tag :type="row.overtime ? 'warning' : 'success'" size="small">
                {{ row.overtime ? "Yes" : "No" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="hours" label="Hours" width="100" />
          <el-table-column prop="created_at" label="Created At" width="180" />
          <el-table-column label="Action" width="100" v-if="userStore.isAdmin">
            <template #default="{ $index }">
              <el-button
                type="danger"
                size="small"
                @click="handleDelete($index)"
              >
                Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="chart-section">
        <h2>Project Hours Distribution</h2>
        <EchartsChart :option="chartOption" height="400px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStore } from "@/store/user";
import EchartsChart from "@/components/EchartsChart.vue";

interface WorkOrder {
  id: string;
  project: string;
  overtime: boolean;
  hours: number;
  created_at: string;
}

const router = useRouter();
const userStore = useUserStore();

const workOrders = reactive<WorkOrder[]>([
  {
    id: "001",
    project: "Road Project A",
    overtime: true,
    hours: 3.5,
    created_at: "2024-04-10 10:30",
  },
  {
    id: "002",
    project: "Bridge Maintenance B",
    overtime: false,
    hours: 2,
    created_at: "2024-04-09 13:00",
  },
  {
    id: "003",
    project: "Pipeline Fix C",
    overtime: true,
    hours: 4.5,
    created_at: "2024-04-08 08:00",
  },
  {
    id: "004",
    project: "Bridge Maintenance B",
    overtime: true,
    hours: 3,
    created_at: "2024-04-07 16:45",
  },
  {
    id: "005",
    project: "Tunnel Cleaning D",
    overtime: false,
    hours: 8.1,
    created_at: "2024-04-03 11:43",
  },
]);

const getProjectHoursData = () => {
  const projectMap = new Map<string, number>();

  workOrders.forEach((order) => {
    const currentHours = projectMap.get(order.project) || 0;
    projectMap.set(order.project, currentHours + order.hours);
  });

  const projects = Array.from(projectMap.keys());
  const hours = Array.from(projectMap.values());

  return { projects, hours };
};

const chartOption = computed(() => {
  const { projects, hours } = getProjectHoursData();

  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: projects,
      axisLabel: {
        rotate: 15,
        interval: 0,
      },
    },
    yAxis: {
      type: "value",
      name: "Hours",
    },
    series: [
      {
        name: "Hours",
        type: "bar",
        data: hours,
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#83bff6" },
              { offset: 0.5, color: "#188df0" },
              { offset: 1, color: "#188df0" },
            ],
          },
        },
        emphasis: {
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "#2378f7" },
                { offset: 0.7, color: "#2378f7" },
                { offset: 1, color: "#83bff6" },
              ],
            },
          },
        },
      },
    ],
  };
});

const handleDelete = async (index: number) => {
  try {
    await ElMessageBox.confirm("确定要删除这条工单记录吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    workOrders.splice(index, 1);
    ElMessage.success("删除成功");
  } catch {
    // 用户取消删除
  }
};

const handleLogout = () => {
  userStore.logout();
  ElMessage.success("已退出登录");
  router.push("/login");
};

onMounted(() => {
  if (!userStore.isLoggedIn) {
    router.push("/login");
  }
});
</script>

<style scoped lang="less">
.main-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  h1 {
    margin: 0;
    font-size: 24px;
    color: #333;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;

    span {
      color: #666;
    }
  }
}

.content {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.table-section,
.chart-section {
  flex: 1;
  min-width: 400px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  h2 {
    margin: 0 0 16px 0;
    font-size: 18px;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 12px;
  }
}
</style>
