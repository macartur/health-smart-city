# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
#   

health_centres = [
	{ long: 12345, lat: 54332, cnes: "ABC", name: "Unidade Butanta", beds: 55, phone: "1130912083", census_district: "Butanta"},
	{ long: 45321, lat: 9876, cnes: "XYZ", name: "Unidade Rio Pequeno", beds: 44, phone: "1130915544", census_district: "Rio Pequeno"},




]

HealthCentre.create health_centres
