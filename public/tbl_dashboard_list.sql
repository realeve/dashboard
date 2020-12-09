CREATE TABLE `tbl_dashboard_list`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `rec_time` datetime(0) NULL DEFAULT NULL,
  `publish` int(11) NULL DEFAULT 1,
  `is_hide` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Triggers structure for table tbl_dashboard_list
-- ----------------------------
DROP TRIGGER IF EXISTS `ds_rectime`;
delimiter ;;
CREATE TRIGGER `ds_rectime` BEFORE INSERT ON `tbl_dashboard_list` FOR EACH ROW set new.rec_time = CURRENT_TIMESTAMP
;;
delimiter ;
