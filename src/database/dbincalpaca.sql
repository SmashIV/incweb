-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-05-2025 a las 05:38:10
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dbincalpaca`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--
SET FOREIGN_KEY_CHECKS=0;

-- 1. Tablas sin foreign key
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `firebase_uid` varchar(128) NOT NULL,
  `rol` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`firebase_uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `categoria`;
CREATE TABLE `categoria` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `cupon`;
CREATE TABLE `cupon` (
  `id_cupon` INT NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(50) NOT NULL UNIQUE,
  `descripcion` VARCHAR(255),
  `descuento_porcentaje` DECIMAL(5,2) DEFAULT NULL,
  `descuento_fijo` DECIMAL(10,2) DEFAULT NULL,
  `fecha_inicio` DATE,
  `fecha_fin` DATE,
  `activo` TINYINT(1) DEFAULT 1,
  `uso_maximo` INT DEFAULT NULL,
  `usos_realizados` INT DEFAULT 0,
  PRIMARY KEY (`id_cupon`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `metodo_pago`;
CREATE TABLE `metodo_pago` (
  `id_metodo_pago` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_metodo` varchar(50) NOT NULL,
  PRIMARY KEY (`id_metodo_pago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2. Tablas que dependen de las anteriores
DROP TABLE IF EXISTS `producto`;
CREATE TABLE `producto` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL,
  `estado` enum('disponible','agotado','retirado') NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `genero` enum('hombre','mujer','unisex','accesorios','hogar') NOT NULL DEFAULT 'unisex',
  PRIMARY KEY (`id_producto`),
  FOREIGN KEY (`id_categoria`) REFERENCES `categoria`(`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 3. Tablas de usuario dependientes
DROP TABLE IF EXISTS `usuario_datos`;
CREATE TABLE `usuario_datos` (
  `id_datos` INT NOT NULL AUTO_INCREMENT,
  `firebase_uid` VARCHAR(128) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `dni` VARCHAR(20),
  `telefono` VARCHAR(20),
  `fecha_nacimiento` DATE,
  `genero` ENUM('masculino','femenino','otro') DEFAULT NULL,
  PRIMARY KEY (`id_datos`),
  FOREIGN KEY (`firebase_uid`) REFERENCES `usuarios`(`firebase_uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `direccion_usuario`;
CREATE TABLE `direccion_usuario` (
  `id_direccion` INT NOT NULL AUTO_INCREMENT,
  `firebase_uid` VARCHAR(128) NOT NULL,
  `titulo` VARCHAR(50) DEFAULT NULL,
  `direccion` VARCHAR(255) NOT NULL,
  `departamento` VARCHAR(100) NOT NULL,
  `provincia` VARCHAR(100) NOT NULL,
  `distrito` VARCHAR(100) NOT NULL,
  `referencia` VARCHAR(255) DEFAULT NULL,
  `codigo_postal` VARCHAR(20) DEFAULT NULL,
  `es_principal` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`id_direccion`),
  FOREIGN KEY (`firebase_uid`) REFERENCES `usuarios`(`firebase_uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4. Tablas dependientes de producto
DROP TABLE IF EXISTS `producto_imagen`;
CREATE TABLE `producto_imagen` (
  `id_imagen` INT NOT NULL AUTO_INCREMENT,
  `id_producto` INT NOT NULL,
  `url_imagen` VARCHAR(255) NOT NULL,
  `orden` INT DEFAULT 0,
  PRIMARY KEY (`id_imagen`),
  FOREIGN KEY (`id_producto`) REFERENCES `producto`(`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 5. Tablas de carrito y dependientes
DROP TABLE IF EXISTS `carrito`;
CREATE TABLE `carrito` (
  `id_carrito` int(11) NOT NULL AUTO_INCREMENT,
  `firebase_uid` varchar(128) NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `fecha_actual` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_carrito`),
  FOREIGN KEY (`firebase_uid`) REFERENCES `usuarios`(`firebase_uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `carrito_producto`;
CREATE TABLE `carrito_producto` (
  `id_carrito_producto` int(11) NOT NULL AUTO_INCREMENT,
  `id_carrito` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad_producto` int(11) NOT NULL,
  PRIMARY KEY (`id_carrito_producto`),
  FOREIGN KEY (`id_carrito`) REFERENCES `carrito`(`id_carrito`),
  FOREIGN KEY (`id_producto`) REFERENCES `producto`(`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `distincion`;
CREATE TABLE `distincion` (
  `id_distincion` int(11) NOT NULL AUTO_INCREMENT,
  `id_carrito` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `genero` enum('hombre','mujer','unisex') NOT NULL,
  `talla` varchar(255) NOT NULL,
  PRIMARY KEY (`id_distincion`),
  FOREIGN KEY (`id_carrito`) REFERENCES `carrito`(`id_carrito`),
  FOREIGN KEY (`id_producto`) REFERENCES `producto`(`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 6. Tablas de pedidos y dependientes
DROP TABLE IF EXISTS `pedido`;
CREATE TABLE `pedido` (
  `id_pedido` int(11) NOT NULL AUTO_INCREMENT,
  `firebase_uid` varchar(128) NOT NULL,
  `total_pago` decimal(10,2) NOT NULL,
  `fecha_orden` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `estado` enum('pendiente','pagado') NOT NULL,
  `id_cupon` INT DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  FOREIGN KEY (`firebase_uid`) REFERENCES `usuarios`(`firebase_uid`),
  FOREIGN KEY (`id_cupon`) REFERENCES `cupon`(`id_cupon`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `pedido_producto`;
CREATE TABLE `pedido_producto` (
  `id_pedido_producto` int(11) NOT NULL AUTO_INCREMENT,
  `id_pedido` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_pedido_producto`),
  FOREIGN KEY (`id_pedido`) REFERENCES `pedido`(`id_pedido`),
  FOREIGN KEY (`id_producto`) REFERENCES `producto`(`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `pago`;
CREATE TABLE `pago` (
  `id_pago` int(11) NOT NULL AUTO_INCREMENT,
  `id_pedido` int(11) NOT NULL,
  `id_metodo_pago` int(11) NOT NULL,
  `estado_pago` enum('pendiente','completado','fallido') NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_pago` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `mp_payment_id` varchar(128) DEFAULT NULL,
  `np_payment_id` varchar(128) DEFAULT NULL,
  `payment_response` text DEFAULT NULL,
  PRIMARY KEY (`id_pago`),
  FOREIGN KEY (`id_pedido`) REFERENCES `pedido`(`id_pedido`),
  FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago`(`id_metodo_pago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `promociones`;
CREATE TABLE `promociones` (
  `id_promociones` int(11) NOT NULL AUTO_INCREMENT,
  `id_producto` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `descuento_porcentaje` decimal(10,2) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `tipo_aplicacion` enum('producto','categoria') NOT NULL,
  PRIMARY KEY (`id_promociones`),
  FOREIGN KEY (`id_categoria`) REFERENCES `categoria`(`id_categoria`),
  FOREIGN KEY (`id_producto`) REFERENCES `producto`(`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `consulta`;
CREATE TABLE `consulta` (
  `id_consulta` int(11) NOT NULL AUTO_INCREMENT,
  `firebase_uid` varchar(128) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `ciudad` varchar(100) NOT NULL,
  `tipo_consulta` varchar(100) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_envio` datetime NOT NULL,
  PRIMARY KEY (`id_consulta`),
  FOREIGN KEY (`firebase_uid`) REFERENCES `usuarios`(`firebase_uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `quejas`;
CREATE TABLE `quejas` (
  `id_quejas` int(11) NOT NULL AUTO_INCREMENT,
  `firebase_uid` varchar(128) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `asunto` varchar(255) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_quejas`),
  FOREIGN KEY (`firebase_uid`) REFERENCES `usuarios`(`firebase_uid`),
  FOREIGN KEY (`id_pedido`) REFERENCES `pedido`(`id_pedido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS=1;
--
-- Índices para tablas volcadas
--

COMMIT;
--
-- Indices de la tabla `carrito`
--

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;