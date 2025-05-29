# Blueprint de FinanzApp

## Descripción general

FinanzApp es una aplicación de gestión financiera personal que permite a los usuarios registrar ingresos y gastos, configurar su salario y frecuencia de pago, llevar un seguimiento de gastos recurrentes, visualizar su información financiera en gráficas, proyectar sus finanzas en un calendario y simular metas de ahorro.

## Tecnologías utilizadas

- **Expo Go**: Framework para desarrollo de aplicaciones móviles React Native
- **Redux**: Para la gestión del estado de la aplicación
- **NativeWind (TailwindCSS)**: Para el estilizado de la interfaz
- **React Navigation**: Para la navegación entre pantallas
- **Fecha-fns**: Para el manejo de fechas
- **React Native Chart Kit**: Para visualizar gráficos de datos financieros

## Estructura de la aplicación

### Screens (Pantallas)
1. **HomeScreen**: Pantalla principal con resumen de balance, últimas transacciones y accesos rápidos.
2. **AddIncomeScreen**: Permite registrar ingresos y categorizarlos.
3. **AddExpenseScreen**: Permite registrar gastos y configurar si son recurrentes.
4. **StatisticsScreen**: Muestra gráficos y estadísticas de ingresos y gastos.
5. **CalendarView**: Muestra una proyección de ingresos y gastos futuros en un calendario.
6. **SavingsSimulation**: Permite simular metas de ahorro y verificar su viabilidad.
7. **SettingsScreen**: Permite configurar el salario y preferencias de la app.

### Componentes
1. **Button**: Botón personalizado con diferentes estilos.
2. **Card**: Contenedor para agrupar contenido.
3. **Chart**: Componente para visualizar gráficos financieros.
4. **TransactionItem**: Componente para mostrar un ingreso o gasto.

### Estado (Redux)
La aplicación utiliza Redux para el manejo de estado con las siguientes funcionalidades:
- Registro de balance actual
- Gestión de ingresos y gastos
- Configuración de sueldo (monto, frecuencia, día de pago)
- Gestión de gastos recurrentes
- Configuración de metas de ahorro

### Características principales
1. **Registro de ingresos y gastos**: Los usuarios pueden registrar sus ingresos y gastos con categorías personalizadas.
2. **Gestión de salario**: Configuración del monto, frecuencia (semanal, quincenal, mensual) y día de pago.
3. **Gastos recurrentes**: Permite configurar gastos que se repiten con cierta frecuencia (servicios, suscripciones, etc.).
4. **Estadísticas visuales**: Gráficos de ingresos vs gastos y distribución por categorías.
5. **Proyección en calendario**: Visualización de ingresos y gastos proyectados a lo largo del tiempo.
6. **Simulación de ahorro**: Herramienta para verificar si una meta de ahorro es viable según los ingresos y gastos actuales.
7. **Notificaciones**: Alertas para gastos próximos y días de pago.

## Diseño visual
El diseño de la aplicación se basa en un estilo moderno y limpio con colores primarios en amarillo y gris, siguiendo las referencias proporcionadas en las imágenes. Utiliza interfaces claras con tarjetas para organizar la información, botones redondeados, elementos resaltados para acciones importantes y visualizaciones gráficas para los datos financieros.

## Funcionamiento de la aplicación
1. El usuario configura su salario, frecuencia y día de pago.
2. Registra sus gastos recurrentes (servicios, alquiler, suscripciones, etc.).
3. Añade ingresos y gastos adicionales.
4. Puede visualizar su balance actual y revisar estadísticas de sus finanzas.
5. Utiliza la vista de calendario para proyectar ingresos y gastos futuros.
6. Simula objetivos de ahorro para verificar si son alcanzables según su situación financiera actual.

## Próximos pasos para la implementación
1. Ejecutar la aplicación con `expo start`.
2. Probar la navegación entre pantallas y la funcionalidad básica.
3. Refinar el diseño visual y la experiencia de usuario.
4. Implementar almacenamiento persistente con AsyncStorage o una base de datos.
5. Añadir funcionalidades adicionales como exportación de datos, sincronización en la nube, etc.

Con este blueprint, tienes una visión completa de la estructura y funcionalidad de la aplicación de gestión financiera personal que permitirá a los usuarios controlar sus finanzas, proyectar sus gastos y planificar sus ahorros.