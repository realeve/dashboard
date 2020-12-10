CREATE TABLE `tbl_dashboard_business`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '标题',
  `category_main` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '一级分类',
  `category_sub` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '2级分类',
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '缩略图',
  `config` json NULL COMMENT 'json配置项',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '作者',
  `is_hide` int(11) NULL DEFAULT 0 COMMENT '是否删除',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '生成时间',
  `useage_times` int(11) NULL DEFAULT NULL COMMENT '使用次数',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;


-- ----------------------------
-- Triggers structure for table tbl_dashboard_business
-- ----------------------------
DROP TRIGGER IF EXISTS `onadd`;
delimiter ;;
CREATE TRIGGER `onadd` BEFORE INSERT ON `tbl_dashboard_business` FOR EACH ROW set new.create_time=CURRENT_TIMESTAMP,new.update_time = CURRENT_TIMESTAMP
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table tbl_dashboard_business
-- ----------------------------
DROP TRIGGER IF EXISTS `onupdate`;
delimiter ;;
CREATE TRIGGER `onupdate` BEFORE UPDATE ON `tbl_dashboard_business` FOR EACH ROW SET new.update_time = CURRENT_TIMESTAMP
;;
delimiter ;
 