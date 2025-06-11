-- we don't know how to generate root <with-no-name> (class Root) :(

create table categoria
(
    id_categoria int auto_increment
        primary key,
    nombre       varchar(255) not null,
    descripcion  varchar(255) not null
)
    collate = utf8mb4_general_ci;

create table cupon
(
    id_cupon             int auto_increment
        primary key,
    codigo               varchar(50)          not null,
    descripcion          varchar(255)         null,
    descuento_porcentaje decimal(5, 2)        null,
    descuento_fijo       decimal(10, 2)       null,
    fecha_inicio         date                 null,
    fecha_fin            date                 null,
    activo               tinyint(1) default 1 null,
    uso_maximo           int                  null,
    usos_realizados      int        default 0 null,
    constraint codigo
        unique (codigo)
)
    collate = utf8mb4_general_ci;

create table metodo_pago
(
    id_metodo_pago int auto_increment
        primary key,
    nombre_metodo  varchar(50) not null
)
    collate = utf8mb4_general_ci;

create table producto
(
    id_producto     int auto_increment
        primary key,
    id_categoria    int                                                                        not null,
    nombre          varchar(255)                                                               not null,
    descripcion     text                                                                       not null,
    precio_unitario decimal(10, 2)                                                             not null,
    stock           int                                                                        not null,
    estado          enum ('disponible', 'agotado', 'retirado')                                 not null,
    imagen          varchar(255)                                                               not null,
    genero          enum ('hombre', 'mujer', 'unisex', 'accesorios', 'hogar') default 'unisex' not null,
    constraint producto_ibfk_1
        foreign key (id_categoria) references categoria (id_categoria)
)
    collate = utf8mb4_general_ci;

create index id_categoria
    on producto (id_categoria);

create table producto_imagen
(
    id_imagen   int auto_increment
        primary key,
    id_producto int           not null,
    url_imagen  varchar(255)  not null,
    orden       int default 0 null,
    constraint producto_imagen_ibfk_1
        foreign key (id_producto) references producto (id_producto)
)
    collate = utf8mb4_general_ci;

create index id_producto
    on producto_imagen (id_producto);

create table promociones
(
    id_promociones       int auto_increment
        primary key,
    id_producto          int                            not null,
    id_categoria         int                            not null,
    titulo               varchar(255)                   not null,
    descripcion          text                           not null,
    descuento_porcentaje decimal(10, 2)                 not null,
    fecha_inicio         date                           not null,
    fecha_fin            date                           not null,
    tipo_aplicacion      enum ('producto', 'categoria') not null,
    constraint promociones_ibfk_1
        foreign key (id_categoria) references categoria (id_categoria),
    constraint promociones_ibfk_2
        foreign key (id_producto) references producto (id_producto)
)
    collate = utf8mb4_general_ci;

create index id_categoria
    on promociones (id_categoria);

create index id_producto
    on promociones (id_producto);

create table usuarios
(
    firebase_uid varchar(128)                          not null
        primary key,
    rol          varchar(255)                          not null,
    email        varchar(255)                          not null,
    creado_en    timestamp default current_timestamp() not null on update current_timestamp()
)
    collate = utf8mb4_general_ci;

create table carrito
(
    id_carrito   int auto_increment
        primary key,
    firebase_uid varchar(128)                          not null,
    activo       tinyint(1)                            not null,
    fecha_actual timestamp default current_timestamp() not null on update current_timestamp(),
    constraint carrito_ibfk_1
        foreign key (firebase_uid) references usuarios (firebase_uid)
)
    collate = utf8mb4_general_ci;

create index firebase_uid
    on carrito (firebase_uid);

create table carrito_producto
(
    id_carrito_producto int auto_increment
        primary key,
    id_carrito          int                     not null,
    id_producto         int                     not null,
    cantidad_producto   int                     not null,
    talla               varchar(255) default '' not null,
    constraint carrito_producto_ibfk_1
        foreign key (id_carrito) references carrito (id_carrito),
    constraint carrito_producto_ibfk_2
        foreign key (id_producto) references producto (id_producto)
)
    collate = utf8mb4_general_ci;

create index id_carrito
    on carrito_producto (id_carrito);

create index id_producto
    on carrito_producto (id_producto);

create table consulta
(
    id_consulta   int auto_increment
        primary key,
    firebase_uid  varchar(128) not null,
    nombre        varchar(255) not null,
    email         varchar(255) not null,
    telefono      varchar(20)  not null,
    ciudad        varchar(100) not null,
    tipo_consulta varchar(100) not null,
    mensaje       text         not null,
    fecha_envio   datetime     not null,
    constraint consulta_ibfk_1
        foreign key (firebase_uid) references usuarios (firebase_uid)
)
    collate = utf8mb4_general_ci;

create index firebase_uid
    on consulta (firebase_uid);

create table direccion_usuario
(
    id_direccion  int auto_increment
        primary key,
    firebase_uid  varchar(128)         not null,
    titulo        varchar(50)          null,
    direccion     varchar(255)         not null,
    departamento  varchar(100)         not null,
    provincia     varchar(100)         not null,
    distrito      varchar(100)         not null,
    referencia    varchar(255)         null,
    codigo_postal varchar(20)          null,
    es_principal  tinyint(1) default 0 null,
    constraint direccion_usuario_ibfk_1
        foreign key (firebase_uid) references usuarios (firebase_uid)
)
    collate = utf8mb4_general_ci;

create index firebase_uid
    on direccion_usuario (firebase_uid);

create table pedido
(
    id_pedido    int auto_increment
        primary key,
    firebase_uid varchar(128)                          not null,
    total_pago   decimal(10, 2)                        not null,
    fecha_orden  timestamp default current_timestamp() not null on update current_timestamp(),
    estado       enum ('pendiente', 'pagado')          not null,
    id_cupon     int                                   null,
    constraint pedido_ibfk_1
        foreign key (firebase_uid) references usuarios (firebase_uid),
    constraint pedido_ibfk_2
        foreign key (id_cupon) references cupon (id_cupon)
)
    collate = utf8mb4_general_ci;

create table pago
(
    id_pago          int auto_increment
        primary key,
    id_pedido        int                                         not null,
    id_metodo_pago   int                                         not null,
    estado_pago      enum ('pendiente', 'completado', 'fallido') not null,
    monto            decimal(10, 2)                              not null,
    fecha_pago       timestamp default current_timestamp()       not null on update current_timestamp(),
    mp_payment_id    varchar(128)                                null,
    np_payment_id    varchar(128)                                null,
    payment_response text                                        null,
    constraint pago_ibfk_1
        foreign key (id_pedido) references pedido (id_pedido),
    constraint pago_ibfk_2
        foreign key (id_metodo_pago) references metodo_pago (id_metodo_pago)
)
    collate = utf8mb4_general_ci;

create index id_metodo_pago
    on pago (id_metodo_pago);

create index id_pedido
    on pago (id_pedido);

create index firebase_uid
    on pedido (firebase_uid);

create index id_cupon
    on pedido (id_cupon);

create table pedido_producto
(
    id_pedido_producto int auto_increment
        primary key,
    id_pedido          int            not null,
    id_producto        int            not null,
    cantidad           int            not null,
    precio             decimal(10, 2) not null,
    constraint pedido_producto_ibfk_1
        foreign key (id_pedido) references pedido (id_pedido),
    constraint pedido_producto_ibfk_2
        foreign key (id_producto) references producto (id_producto)
)
    collate = utf8mb4_general_ci;

create index id_pedido
    on pedido_producto (id_pedido);

create index id_producto
    on pedido_producto (id_producto);

create table quejas
(
    id_quejas    int auto_increment
        primary key,
    firebase_uid varchar(128)                          not null,
    id_pedido    int                                   not null,
    asunto       varchar(255)                          not null,
    mensaje      text                                  not null,
    fecha_envio  timestamp default current_timestamp() not null on update current_timestamp(),
    constraint quejas_ibfk_1
        foreign key (firebase_uid) references usuarios (firebase_uid),
    constraint quejas_ibfk_2
        foreign key (id_pedido) references pedido (id_pedido)
)
    collate = utf8mb4_general_ci;

create index firebase_uid
    on quejas (firebase_uid);

create index id_pedido
    on quejas (id_pedido);

create table usuario_datos
(
    id_datos         int auto_increment
        primary key,
    firebase_uid     varchar(128)                           not null,
    nombre           varchar(100)                           not null,
    apellido         varchar(100)                           not null,
    dni              varchar(20)                            null,
    telefono         varchar(20)                            null,
    fecha_nacimiento date                                   null,
    genero           enum ('masculino', 'femenino', 'otro') null,
    constraint usuario_datos_ibfk_1
        foreign key (firebase_uid) references usuarios (firebase_uid)
)
    collate = utf8mb4_general_ci;

create index firebase_uid
    on usuario_datos (firebase_uid);

-- Insertar datos de ejemplo para la tabla usuarios
INSERT INTO usuarios (firebase_uid, rol, email) VALUES
('admin123', 'admin', 'admin@example.com'),
('user123', 'user', 'user@example.com'),
('user456', 'user', 'user2@example.com');

-- Insertar datos de ejemplo para la tabla usuario_datos
INSERT INTO usuario_datos (firebase_uid, nombre, apellido, dni, telefono, fecha_nacimiento, genero) VALUES
('admin123', 'Admin', 'User', '12345678', '999888777', '1990-01-01', 'masculino'),
('user123', 'John', 'Doe', '87654321', '999777666', '1995-05-15', 'masculino'),
('user456', 'Jane', 'Smith', '98765432', '999666555', '1992-08-20', 'femenino');

