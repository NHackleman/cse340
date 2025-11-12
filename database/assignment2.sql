-- W02 Assignment - Task 1 SQL Statements

-- Query 1: Insert Tony Stark
INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
  );

-- Query 2: Update Tony Stark to Admin
UPDATE public.account
SET account_type = 'Admin'::account_type
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Query 3: Delete Tony Stark
DELETE FROM public.account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Query 4: Update GM Hummer Description
UPDATE public.inventory
SET
  inv_description = REPLACE(
    inv_description,
    'small interiors',
    'a huge interior'
  )
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Query 5: Select Sport Vehicles with a JOIN
SELECT inv.inv_make, inv.inv_model, cla.classification_name
FROM public.inventory AS inv
INNER JOIN public.classification AS cla
  ON inv.classification_id = cla.classification_id
WHERE cla.classification_name = 'Sport';

-- Query 6: Update All Image Paths
UPDATE public.inventory
SET
  inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');