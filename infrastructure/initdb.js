const { getPool } = require("./database");
const { func } = require("joi");
const pool = await database.getPool();
require("dotenv").config();

let connection;

async function main() {
  console.log(`comprobando tablas`);
  try {
    connection = getPool();
    console.log(`borrando tablas`);
    await connection.query("DROP TABLE IF EXISTS `mydb`.`inquilinos`");
    await connection.query("DROP TABLE IF EXISTS `mydb`.`valoraciones`");
    await connection.query("DROP TABLE IF EXISTS `mydb`.`Inmuebles`");
    await connection.query("DROP TABLE IF EXISTS `mydb`.`Alquileres`");
    await connection.query("DROP TABLE IF EXISTS `mydb`.`contratos`");
    await connection.query("DROP TABLE IF EXISTS `mydb`.`users`");
    await connection.query("DROP TABLE IF EXISTS `mydb`.`caseros`");
    console.log("táboas borradas");
    /* 
  CREATE TABLE IF NOT EXISTS `mydb`.`valoraciones` (
    `id_valoracion` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_casero` INT UNSIGNED NULL,
    `id_inquilino` INT UNSIGNED NULL,
    `id_casa` INT UNSIGNED NULL,
    `valoracion` VARCHAR(240) NOT NULL,
    `fecha` DATE NOT NULL,
    `puntuacion` VARCHAR(10) NOT NULL,
    PRIMARY KEY (`id_valoracion`))
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4;


  -- -----------------------------------------------------
  -- Table `mydb`.`Inmuebles`
  -- -----------------------------------------------------
   ;

  CREATE TABLE IF NOT EXISTS `mydb`.`Inmuebles` (
    `id_casa` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_casero` INT UNSIGNED NULL,
    `localidad` VARCHAR(45) NOT NULL,
    `id_contrato` INT UNSIGNED NULL,
    `fotos` VARCHAR(45) NOT NULL,
    `superficie` VARCHAR(45) NOT NULL,
    `habitaciones` VARCHAR(45) NOT NULL,
    `baños` VARCHAR(45) NOT NULL,
    `cocinas` VARCHAR(45) NOT NULL,
    `salones` VARCHAR(45) NOT NULL,
    `garajes` VARCHAR(45) NOT NULL,
    `trasteros` VARCHAR(45) NOT NULL,
    `cp` VARCHAR(45) NOT NULL,
    `id_valoracion` INT UNSIGNED NULL,
    PRIMARY KEY (`id_casa`),
    INDEX `fk_valoracion_inmueble_idx` (`id_valoracion` ASC) VISIBLE,
    CONSTRAINT `fk_valoracion_inmueble`
      FOREIGN KEY (`id_valoracion`)
      REFERENCES `mydb`.`valoraciones` (`id_valoracion`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4;


  -- -----------------------------------------------------
  -- Table `mydb`.`Alquileres`
  -- -----------------------------------------------------
  
  CREATE TABLE IF NOT EXISTS `mydb`.`Alquileres` (
    `id_alquiler` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_casa` INT UNSIGNED NULL,
    `id_inquilino` INT UNSIGNED NULL,
    `id_casero` INT UNSIGNED NULL,
    `id_contrato` INT UNSIGNED NULL,
    PRIMARY KEY (`id_alquiler`),
    INDEX `fk_alquiler_casa_idx` (`id_casa` ASC) VISIBLE,
    CONSTRAINT `fk_alquiler_casa`
      FOREIGN KEY (`id_casa`)
      REFERENCES `mydb`.`Inmuebles` (`id_casa`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4;


  -- -----------------------------------------------------
  -- Table `mydb`.`contratos`
  -- -----------------------------------------------------
  

  CREATE TABLE IF NOT EXISTS `mydb`.`contratos` (
    `id_contrato` INT UNSIGNED NOT NULL,
    `id_casa` INT UNSIGNED NULL,
    `id_casero` INT UNSIGNED NULL,
    `id_inquilino` INT UNSIGNED NULL,
    PRIMARY KEY (`id_contrato`),
    INDEX `fk_contrato_casa_idx` (`id_casa` ASC) VISIBLE,
    CONSTRAINT `fk_contrato_casa`
      FOREIGN KEY (`id_casa`)
      REFERENCES `mydb`.`Inmuebles` (`id_casa`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4;


  -- -----------------------------------------------------
  -- Table `mydb`.`users`
  -- -----------------------------------------------------
   

  CREATE TABLE IF NOT EXISTS mydb.users (
    `id_user` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_casero` INT UNSIGNED NULL,
    `id_inquilino` INT UNSIGNED NULL,
    `name` VARCHAR(40) NOT NULL,
    `lastName` VARCHAR(40) NOT NULL,
    `email` VARCHAR(40) NOT NULL,
    `phone` VARCHAR(30) NOT NULL,
    `foto` VARCHAR(255) NOT NULL,
    `password` VARCHAR(20) NOT NULL,
    `biografia` VARCHAR(140) NOT NULL,
    `status` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id_user`))
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4;


  -- -----------------------------------------------------
  -- Table `mydb`.`caseros`
  -- -----------------------------------------------------
  

  CREATE TABLE IF NOT EXISTS `mydb`.`caseros` (
    `id_casero` INT UNSIGNED NOT NULL,
    `id_casa` INT UNSIGNED NULL,
    `id_alquiler` INT UNSIGNED NULL,
    `id_contrato` INT UNSIGNED NULL,
    `id_valoracion` INT UNSIGNED NULL,
    PRIMARY KEY (`id_casero`),
    INDEX `fk_casero_contrato_idx` (`id_contrato` ASC) VISIBLE,
    INDEX `fk_valoracion_casero_idx` (`id_valoracion` ASC) VISIBLE,
    INDEX `fk_casero_inmueble_idx` (`id_casa` ASC) VISIBLE,
    CONSTRAINT `fk_usuario_casero`
      FOREIGN KEY (`id_casero`)
      REFERENCES `mydb`.`users` (`id_user`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
    CONSTRAINT `fk_casero_contrato`
      FOREIGN KEY (`id_contrato`)
      REFERENCES `mydb`.`contratos` (`id_contrato`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
    CONSTRAINT `fk_valoracion_casero`
      FOREIGN KEY (`id_valoracion`)
      REFERENCES `mydb`.`valoraciones` (`id_valoracion`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
    CONSTRAINT `fk_casero_inmueble`
      FOREIGN KEY (`id_casa`)
      REFERENCES `mydb`.`Inmuebles` (`id_casa`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4;


  -- -----------------------------------------------------
  -- Table `mydb`.`inquilinos`
  -- -----------------------------------------------------

  CREATE TABLE IF NOT EXISTS `mydb`.`inquilinos` (
    `id_inquilino` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_alquiler` INT UNSIGNED NULL,
    `id_casa` INT UNSIGNED NULL,
    `id_user` INT UNSIGNED NULL,
    `id_valoracion` INT UNSIGNED NULL,
    `id_contrato` INT UNSIGNED NULL,
    PRIMARY KEY (`id_inquilino`),
    INDEX `fk_usuario_inquilino_idx` (`id_contrato` ASC) VISIBLE,
    INDEX `fk_valoracion_inquilino_idx` (`id_valoracion` ASC) VISIBLE,
    INDEX `fk_inquilino_alquiler_idx` (`id_alquiler` ASC) VISIBLE,
    CONSTRAINT `fk_user_inquilino`
      FOREIGN KEY (`id_contrato`)
      REFERENCES `mydb`.`users` (`id_user`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
    CONSTRAINT `fk_valoracion_inquilino`
      FOREIGN KEY (`id_valoracion`)
      REFERENCES `mydb`.`valoracion` (`id_valoracion`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
    CONSTRAINT `fk_contrato_inquilino`
      FOREIGN KEY (`id_contrato`)
      REFERENCES `mydb`.`contratos` (`id_contrato`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
    CONSTRAINT `fk_inquilino_alquiler`
      FOREIGN KEY (`id_alquiler`)
      REFERENCES `mydb`.`Alquileres` (`id_alquiler`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4;


  SET SQL_MODE=@OLD_SQL_MODE;
  SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
  SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS; */
  } catch (error) {
    console.log(error);
  }
}
main();