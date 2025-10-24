/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  options: {
    tsConfig: {
      fileName: "./tsconfig.json",
    },
    enhancedResolveOptions: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    },
    includeOnly: {
      path: "^(app|components|lib|prisma|reui|middleware\\.ts)",
    },
    exclude: {
      path: "(stories|spec|test)\\.(ts|tsx)$",
    },
    reporterOptions: {
      dot: {
        collapsePattern:
          "^(app/[^/]+|components/[^/]+|lib/[^/]+|prisma/[^/]+|reui/[^/]+|middleware\\.ts)",
      },
    },
  },
  forbidden: [
    {
      name: "no-circular",
      severity: "warn",
      comment: "Циклические зависимости затрудняют поддержку и тестирование.",
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: "not-to-unresolved",
      severity: "error",
      comment: "Все импорты должны разрешаться. Используйте пути из tsconfig.json либо относительные пути.",
      from: {},
      to: {
        couldNotResolve: true,
      },
    },
    {
      name: "no-lib-to-app",
      severity: "warn",
      comment: "Слой lib не должен зависеть от слоя app.",
      from: {
        path: "^lib",
      },
      to: {
        path: "^app",
      },
    },
    {
      name: "no-components-to-app",
      severity: "warn",
      comment: "Переиспользуемые компоненты не должны импортировать файлы из app.",
      from: {
        path: "^components",
      },
      to: {
        path: "^app",
      },
    },
    {
      name: "no-app-to-prisma",
      severity: "warn",
      comment: "Переход к целевой архитектуре подразумевает доступ к данным через lib/сервисы, а не напрямую из маршрутов.",
      from: {
        path: "^app",
      },
      to: {
        path: "^prisma",
      },
    },
    {
      name: "no-orphans",
      severity: "warn",
      comment: "Поддерживайте файлы доступными из корневых точек входа.",
      from: {
        orphan: true,
        pathNot: [
          "app/.*(page|layout|loading|error)\\.tsx$",
          "app/.*route\\.ts$",
          "app/api/.*",
        ],
      },
      to: {},
    },
  ],
};
