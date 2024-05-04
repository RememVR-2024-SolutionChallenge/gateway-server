-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: remember_me
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `badge`
--

DROP TABLE IF EXISTS `badge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `badge` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `groupId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_201561c0706dfdbf7226c474b61` (`groupId`),
  CONSTRAINT `FK_201561c0706dfdbf7226c474b61` FOREIGN KEY (`groupId`) REFERENCES `group` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `badge`
--

LOCK TABLES `badge` WRITE;
/*!40000 ALTER TABLE `badge` DISABLE KEYS */;
/*!40000 ALTER TABLE `badge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group`
--

DROP TABLE IF EXISTS `group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group` (
  `id` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `recipientId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_3dcad5efbf70df1c7468ade629` (`recipientId`),
  CONSTRAINT `FK_3dcad5efbf70df1c7468ade629a` FOREIGN KEY (`recipientId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group`
--

LOCK TABLES `group` WRITE;
/*!40000 ALTER TABLE `group` DISABLE KEYS */;
INSERT INTO `group` VALUES ('102050781405134597521','2024-05-01 12:26:08.148833','2024-05-01 12:26:08.148833',NULL,'102050781405134597521');
/*!40000 ALTER TABLE `group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `isEnrolled` tinyint NOT NULL DEFAULT '0',
  `refreshToken` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `groupAsGiverId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_6cf917c2baa4a00588b7762370a` (`groupAsGiverId`),
  CONSTRAINT `FK_6cf917c2baa4a00588b7762370a` FOREIGN KEY (`groupAsGiverId`) REFERENCES `group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('102050781405134597521','testrecipient0@gmail.com','test_recipient','CareRecipient',1,'','2024-05-01 12:22:22.191195','2024-05-01 12:50:23.000000',NULL,NULL),('105564159577498478896','testgiver0@gmail.com','test_giver','CareGiver',1,'','2024-05-01 12:23:33.872004','2024-05-01 12:56:07.000000',NULL,'102050781405134597521');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vr_resource`
--

DROP TABLE IF EXISTS `vr_resource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vr_resource` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `filePath` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `isSample` tinyint NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `groupId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_472cd9a5dd954301d522b0a8284` (`groupId`),
  CONSTRAINT `FK_472cd9a5dd954301d522b0a8284` FOREIGN KEY (`groupId`) REFERENCES `group` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vr_resource`
--

LOCK TABLES `vr_resource` WRITE;
/*!40000 ALTER TABLE `vr_resource` DISABLE KEYS */;
INSERT INTO `vr_resource` VALUES ('sample-avatar-1','Seoyeon Byun','sample/sample-avatar-1','avatar',1,'2024-05-01 12:09:38.230916','2024-05-01 12:09:38.230916',NULL,NULL),('sample-avatar-2','Jinwoo Choi','sample/sample-avatar-2','avatar',1,'2024-05-01 12:09:38.230916','2024-05-01 12:09:38.230916',NULL,NULL),('sample-avatar-3','Guijung Woo','sample/sample-avatar-3','avatar',1,'2024-05-01 12:09:38.230916','2024-05-01 12:09:38.230916',NULL,NULL),('sample-avatar-4','SeoYoung Kim','sample/sample-avatar-4','avatar',1,'2024-05-01 12:09:38.230916','2024-05-01 12:09:38.230916',NULL,NULL),('sample-scene-1','KU sculpture','sample/sample-scene-1','scene',1,'2024-05-05 04:11:16.785105','2024-05-05 04:11:16.785105',NULL,NULL),('sample-scene-10','Train','sample/sample-scene-10','scene',1,'2024-05-05 04:11:16.785105','2024-05-05 04:11:16.785105',NULL,NULL),('sample-scene-2','KU SKFuture Inside','sample/sample-scene-2','scene',1,'2024-05-05 04:11:16.785105','2024-05-05 04:11:16.785105',NULL,NULL),('sample-scene-3','KU SKFuture Outside','sample/sample-scene-3','scene',1,'2024-05-05 04:11:16.785105','2024-05-05 04:11:16.785105',NULL,NULL),('sample-scene-4','Auditorium','sample/sample-scene-4','scene',1,'2024-05-05 04:11:16.785105','2024-05-05 04:11:16.785105',NULL,NULL),('sample-scene-5','Barn','sample/sample-scene-5','scene',1,'2024-05-05 04:11:16.785105','2024-05-05 04:11:16.785105',NULL,NULL),('sample-scene-6','Bedroom','sample/sample-scene-6','scene',1,'2024-05-05 04:11:16.785105','2024-05-05 04:11:16.785105',NULL,NULL),('sample-scene-7','Church','sample/sample-scene-7','scene',1,'2024-05-05 04:11:16.785105','2024-05-05 04:11:16.785105',NULL,NULL),('sample-scene-8','Ignatius','sample/sample-scene-8','scene',1,'2024-05-05 04:11:16.785105','2024-05-05 04:11:16.785105',NULL,NULL),('sample-scene-9','Playground','sample/sample-scene-9','scene',1,'2024-05-05 04:11:16.785105','2024-05-05 04:11:16.785105',NULL,NULL);
/*!40000 ALTER TABLE `vr_resource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vr_video`
--

DROP TABLE IF EXISTS `vr_video`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vr_video` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `isSample` tinyint NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `groupId` varchar(255) DEFAULT NULL,
  `sceneId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_bf22e53483b99726270416c52a9` (`groupId`),
  KEY `FK_c07303149689194e5649b7ab222` (`sceneId`),
  CONSTRAINT `FK_bf22e53483b99726270416c52a9` FOREIGN KEY (`groupId`) REFERENCES `group` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_c07303149689194e5649b7ab222` FOREIGN KEY (`sceneId`) REFERENCES `vr_resource` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vr_video`
--

LOCK TABLES `vr_video` WRITE;
/*!40000 ALTER TABLE `vr_video` DISABLE KEYS */;
INSERT INTO `vr_video` VALUES ('sample-video-1','Members & KU sculpture',1,'2024-05-05 04:11:16.788461','2024-05-05 04:11:16.788461',NULL,NULL,'sample-scene-1'),('sample-video-2','Members & KU SKFuture Inside',1,'2024-05-05 04:11:16.788461','2024-05-05 04:11:16.788461',NULL,NULL,'sample-scene-2'),('sample-video-3','Members & KU SKFuture Outside',1,'2024-05-05 04:11:16.788461','2024-05-05 04:11:16.788461',NULL,NULL,'sample-scene-3');
/*!40000 ALTER TABLE `vr_video` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vr_video_avatars`
--

DROP TABLE IF EXISTS `vr_video_avatars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vr_video_avatars` (
  `vrVideoId` varchar(255) NOT NULL,
  `vrResourceId` varchar(255) NOT NULL,
  PRIMARY KEY (`vrVideoId`,`vrResourceId`),
  KEY `IDX_1a9429dba126efa5f2058367a5` (`vrVideoId`),
  KEY `IDX_09edae8200ee17c1eacce63cd2` (`vrResourceId`),
  CONSTRAINT `FK_09edae8200ee17c1eacce63cd23` FOREIGN KEY (`vrResourceId`) REFERENCES `vr_resource` (`id`),
  CONSTRAINT `FK_1a9429dba126efa5f2058367a56` FOREIGN KEY (`vrVideoId`) REFERENCES `vr_video` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vr_video_avatars`
--

LOCK TABLES `vr_video_avatars` WRITE;
/*!40000 ALTER TABLE `vr_video_avatars` DISABLE KEYS */;
INSERT INTO `vr_video_avatars` VALUES ('sample-video-1','sample-avatar-1'),('sample-video-1','sample-avatar-2'),('sample-video-1','sample-avatar-3'),('sample-video-1','sample-avatar-4'),('sample-video-2','sample-avatar-1'),('sample-video-2','sample-avatar-2'),('sample-video-2','sample-avatar-3'),('sample-video-2','sample-avatar-4'),('sample-video-3','sample-avatar-1'),('sample-video-3','sample-avatar-2'),('sample-video-3','sample-avatar-3'),('sample-video-3','sample-avatar-4');
/*!40000 ALTER TABLE `vr_video_avatars` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-05  4:16:36
