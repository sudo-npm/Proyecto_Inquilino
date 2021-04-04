-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema inquilino_db
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `inquilino_db` ;

-- -----------------------------------------------------
-- Schema inquilino_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `inquilino_db` DEFAULT CHARACTER SET utf8 ;
CREATE USER 'inquilino'@'localhost' IDENTIFIED WITH mysql_native_password BY 'inquilino1234';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX, DROP, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES ON inquilino_db.* TO 'inquilino'@'localhost';
USE `inquilino_db` ;

-- -----------------------------------------------------
-- Table `inquilino_db`.`usuarios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `inquilino_db`.`usuarios` ;

CREATE TABLE IF NOT EXISTS inquilino_db.usuarios (
  `id_usuario` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(60) NOT NULL,
  `apellidos` VARCHAR(120) NOT NULL,
  `dni` VARCHAR(9) NOT NULL,
  `email` VARCHAR(60) NOT NULL,
  `telefono` VARCHAR(9) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `biografia` VARCHAR(255) NOT NULL,
  `avatar` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

-- -----------------------------------------------------
-- Table `inquilino_db`.`reset`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `inquilino_db`.`reset` ;

CREATE TABLE IF NOT EXISTS inquilino_db.reset (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `token` VARCHAR(255) NOT NULL,
  `id_usuario` INT UNSIGNED NOT NULL,
  `valido_hasta` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_usuario_reset`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `inquilino_db`.`usuarios` (`id_usuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

-- -----------------------------------------------------
-- Table `inquilino_db`.`inmuebles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `inquilino_db`.`inmuebles` ;

CREATE TABLE IF NOT EXISTS `inquilino_db`.`inmuebles` (
  `id_inmueble` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_casero` INT UNSIGNED NOT NULL,
  `id_inquilino` INT UNSIGNED NULL,
  `superficie` VARCHAR(180) NULL,
  `habitaciones` TINYINT NOT NULL,
  `baños` TINYINT NOT NULL,
  `cocinas` TINYINT NOT NULL,
  `salones` TINYINT NOT NULL,
  `garajes` TINYINT NOT NULL,
  `trasteros` TINYINT NOT NULL,
  `cp` VARCHAR(5) NOT NULL,
  `direccion` VARCHAR(200) NOT NULL,
  `ciudad` VARCHAR(150) NOT NULL,
  `precio` VARCHAR(150) NOT NULL,
  `titulo` VARCHAR(140) NOT NULL,
  `estado` ENUM("disponible", "oferta", "alquilado"),
  PRIMARY KEY (`id_inmueble`),
  UNIQUE KEY `id_titulo_casero` (`id_casero`,`titulo`),
  CONSTRAINT `fk_usuario_casero`
    FOREIGN KEY (`id_casero`)
    REFERENCES `inquilino_db`.`usuarios` (`id_usuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_usuario_inquilino`
    FOREIGN KEY (`id_inquilino`)
    REFERENCES `inquilino_db`.`usuarios` (`id_usuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

-- -----------------------------------------------------
-- Table `inquilino_db`.`fotos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `inquilino_db`.`fotos` ;

CREATE TABLE IF NOT EXISTS `inquilino_db`.`fotos` (
  `id_foto` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_inmueble` INT UNSIGNED NOT NULL,
  `url_foto` VARCHAR(245) NOT NULL,
  PRIMARY KEY (`id_foto`),
  CONSTRAINT `fk_inmueble_foto`
    FOREIGN KEY (`id_inmueble`)
    REFERENCES `inquilino_db`.`inmuebles` (`id_inmueble`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

-- -----------------------------------------------------
-- Table `inquilino_db`.`valoraciones`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `inquilino_db`.`valoraciones` ;

CREATE TABLE IF NOT EXISTS `inquilino_db`.`valoraciones` (
  `id_valoracion` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_emisor` INT UNSIGNED NOT NULL,
  `id_receptor` INT UNSIGNED NOT NULL,
  `objeto` ENUM("casero", "inquilino"),
  `puntuacion` TINYINT NOT NULL,
  `valoracion` VARCHAR(240) NOT NULL,
  `fecha` DATETIME NOT NULL,
  PRIMARY KEY (`id_valoracion`),
  CONSTRAINT `fk_emisor_valoracion`
    FOREIGN KEY (`id_emisor`)
    REFERENCES `inquilino_db`.`usuarios` (`id_usuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_receptor_valoracion`
    FOREIGN KEY (`id_receptor`)
    REFERENCES `inquilino_db`.`usuarios` (`id_usuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
