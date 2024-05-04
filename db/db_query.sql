/* ----------------------- Sample VR Resources, Videos ---------------------- */
-- Sapmle Avatars
INSERT INTO vr_resource (id, title, filePath, type, createdAt, updatedAt, deletedAt, groupId, isSample)
VALUES
('sample-avatar-1', 'Seoyeon Byun', 'sample/sample-avatar-1', 'avatar', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL, NULL, 1),
('sample-avatar-2', 'Jinwoo Choi', 'sample/sample-avatar-2', 'avatar', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL, NULL, 1),
('sample-avatar-3', 'Guijung Woo', 'sample/sample-avatar-3', 'avatar', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL, NULL, 1),
('sample-avatar-4', 'SeoYoung Kim', 'sample/sample-avatar-4', 'avatar', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL, NULL, 1);

-- Sample Scenes
INSERT INTO vr_resource (id, title, filePath, type, createdAt, updatedAt, deletedAt, groupId, isSample)
VALUES
('sample-scene-1', 'KU sculpture', 'sample/sample-scene-1', 'scene', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL, NULL, 1),
('sample-scene-2', 'KU SKFuture Inside', 'sample/sample-scene-2', 'scene', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL, NULL, 1),
('sample-scene-3', 'KU SKFuture Outside', 'sample/sample-scene-3', 'scene', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL, NULL, 1),
('sample-scene-4', 'Auditorium', 'sample/sample-scene-4', 'scene', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL, NULL, 1),
('sample-scene-5', 'Barn', 'sample/sample-scene-5', 'scene', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL, NULL, 1),
('sample-scene-6', 'Bedroom', 'sample/sample-scene-6', 'scene', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL, NULL, 1),
('sample-scene-7', 'Church', 'sample/sample-scene-7', 'scene', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL, NULL, 1),
('sample-scene-8', 'Ignatius', 'sample/sample-scene-8', 'scene', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL, NULL, 1),
('sample-scene-9', 'Playground', 'sample/sample-scene-9', 'scene', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL, NULL, 1),
('sample-scene-10', 'Train', 'sample/sample-scene-10', 'scene', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL, NULL, 1);

-- Sample Videos
INSERT INTO vr_video (id, title, isSample, createdAt, updatedAt, deletedAt, groupId, sceneId)
VALUES
('sample-video-1', 'Members & KU sculpture', 1, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL, NULL, 'sample-scene-1'),
('sample-video-2', 'Members & KU SKFuture Inside', 1, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL, NULL, 'sample-scene-2'),
('sample-video-3', 'Members & KU SKFuture Outside', 1, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL, NULL, 'sample-scene-3');

INSERT INTO vr_video_avatars(vrVideoId, vrResourceId)
VALUES
('sample-video-1', 'sample-avatar-1'),
('sample-video-1', 'sample-avatar-2'),
('sample-video-1', 'sample-avatar-3'),
('sample-video-1', 'sample-avatar-4'),
('sample-video-2', 'sample-avatar-1'),
('sample-video-2', 'sample-avatar-2'),
('sample-video-2', 'sample-avatar-3'),
('sample-video-2', 'sample-avatar-4'),
('sample-video-3', 'sample-avatar-1'),
('sample-video-3', 'sample-avatar-2'),
('sample-video-3', 'sample-avatar-3'),
('sample-video-3', 'sample-avatar-4');

/* ---------------------------------- user ---------------------------------- */
-- Test 2 Users for Dev
INSERT INTO `user` VALUES ('102050781405134597521','testrecipient0@gmail.com','test_recipient','CareRecipient',1,'','2024-05-01 12:22:22.191195','2024-05-01 12:50:23.000000',NULL,NULL);
INSERT INTO `group` VALUES ('102050781405134597521','2024-05-01 12:26:08.148833','2024-05-01 12:26:08.148833',NULL,'102050781405134597521');
INSERT INTO `user` VALUES ('105564159577498478896','testgiver0@gmail.com','test_giver','CareGiver',1,'','2024-05-01 12:23:33.872004','2024-05-01 12:56:07.000000',NULL,'102050781405134597521');
