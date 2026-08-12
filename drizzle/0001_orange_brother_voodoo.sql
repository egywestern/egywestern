ALTER TABLE `products` ADD `sale_price` real;
--> statement-breakpoint
INSERT INTO `products` (`name`,`category`,`collection`,`price`,`sale_price`,`stock`,`image`,`sizes`,`colors`,`description`) VALUES
('Metro Line Heavy Tee','T-SHIRTS','NEW DROPS',890,NULL,24,'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85','S, M, L, XL','Black','Heavyweight Cairo essential.'),
('Downtown Box Hoodie','HOODIES','BEST SELLERS',2190,1890,18,'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1200&q=85','S, M, L, XL','Stone','Relaxed fit box hoodie.'),
('26 Utility Cargo','CARGOS','NEW DROPS',1690,NULL,20,'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1200&q=85','S, M, L, XL','Olive','Utility cargo for the city.'),
('Night Shift Jacket','JACKETS','LIMITED EDITION',2490,NULL,9,'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=85','M, L, XL','Black','Limited city jacket.'),
('Cairo Stamp Cap','ACCESSORIES','NEW DROPS',590,NULL,30,'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=85','ONE SIZE','Beige','Signature Cairo cap.'),
('Kasr El Nil Tee','T-SHIRTS','SUMMER 26',790,NULL,26,'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85','S, M, L, XL','White','Summer cotton tee.');
