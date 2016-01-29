# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160127044141) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "ages", force: :cascade do |t|
    t.integer "gender_id", null: false
    t.integer "area_id",   null: false
    t.integer "year_id",   null: false
    t.integer "o0",        null: false
    t.integer "o20",       null: false
    t.integer "o30",       null: false
    t.integer "o40",       null: false
    t.integer "o50",       null: false
    t.integer "o60",       null: false
    t.integer "o70",       null: false
    t.integer "o80",       null: false
    t.integer "unknown",   null: false
  end

  add_index "ages", ["area_id"], name: "index_ages_on_area_id", using: :btree
  add_index "ages", ["gender_id"], name: "index_ages_on_gender_id", using: :btree
  add_index "ages", ["year_id"], name: "index_ages_on_year_id", using: :btree

  create_table "areas", force: :cascade do |t|
    t.integer "content", null: false
    t.string  "name",    null: false
  end

  create_table "attempteds", force: :cascade do |t|
    t.integer "gender_id", null: false
    t.integer "area_id",   null: false
    t.integer "year_id",   null: false
    t.integer "yes",       null: false
    t.integer "no",        null: false
    t.integer "unknown",   null: false
  end

  add_index "attempteds", ["area_id"], name: "index_attempteds_on_area_id", using: :btree
  add_index "attempteds", ["gender_id"], name: "index_attempteds_on_gender_id", using: :btree
  add_index "attempteds", ["year_id"], name: "index_attempteds_on_year_id", using: :btree

  create_table "days", force: :cascade do |t|
    t.integer "gender_id", null: false
    t.integer "area_id",   null: false
    t.integer "year_id",   null: false
    t.integer "monday",    null: false
    t.integer "tuesday",   null: false
    t.integer "wednesday", null: false
    t.integer "thursday",  null: false
    t.integer "friday",    null: false
    t.integer "saturday",  null: false
    t.integer "sunday",    null: false
    t.integer "unknown",   null: false
  end

  add_index "days", ["area_id"], name: "index_days_on_area_id", using: :btree
  add_index "days", ["gender_id"], name: "index_days_on_gender_id", using: :btree
  add_index "days", ["year_id"], name: "index_days_on_year_id", using: :btree

  create_table "genders", force: :cascade do |t|
    t.integer "content", null: false
    t.string  "name",    null: false
  end

  create_table "hours", force: :cascade do |t|
    t.integer "gender_id", null: false
    t.integer "area_id",   null: false
    t.integer "year_id",   null: false
    t.integer "a0",        null: false
    t.integer "a2",        null: false
    t.integer "a4",        null: false
    t.integer "a6",        null: false
    t.integer "a8",        null: false
    t.integer "a10",       null: false
    t.integer "a12",       null: false
    t.integer "a14",       null: false
    t.integer "a16",       null: false
    t.integer "a18",       null: false
    t.integer "a20",       null: false
    t.integer "a22",       null: false
    t.integer "unknown",   null: false
  end

  add_index "hours", ["area_id"], name: "index_hours_on_area_id", using: :btree
  add_index "hours", ["gender_id"], name: "index_hours_on_gender_id", using: :btree
  add_index "hours", ["year_id"], name: "index_hours_on_year_id", using: :btree

  create_table "housemates", force: :cascade do |t|
    t.integer "gender_id", null: false
    t.integer "area_id",   null: false
    t.integer "year_id",   null: false
    t.integer "yes",       null: false
    t.integer "no",        null: false
    t.integer "unknown",   null: false
  end

  add_index "housemates", ["area_id"], name: "index_housemates_on_area_id", using: :btree
  add_index "housemates", ["gender_id"], name: "index_housemates_on_gender_id", using: :btree
  add_index "housemates", ["year_id"], name: "index_housemates_on_year_id", using: :btree

  create_table "jobs", force: :cascade do |t|
    t.integer "gender_id",        null: false
    t.integer "area_id",          null: false
    t.integer "year_id",          null: false
    t.integer "self_employed",    null: false
    t.integer "employed",         null: false
    t.integer "total_unemployed", null: false
    t.integer "student",          null: false
    t.integer "not_student",      null: false
    t.integer "unemployed",       null: false
    t.integer "stay_at_home",     null: false
    t.integer "lost_job",         null: false
    t.integer "pensioner",        null: false
    t.integer "unknown",          null: false
  end

  add_index "jobs", ["area_id"], name: "index_jobs_on_area_id", using: :btree
  add_index "jobs", ["gender_id"], name: "index_jobs_on_gender_id", using: :btree
  add_index "jobs", ["year_id"], name: "index_jobs_on_year_id", using: :btree

  create_table "locations", force: :cascade do |t|
    t.integer "gender_id", null: false
    t.integer "area_id",   null: false
    t.integer "year_id",   null: false
    t.integer "home",      null: false
    t.integer "building",  null: false
    t.integer "vehicle",   null: false
    t.integer "sea",       null: false
    t.integer "mountain",  null: false
    t.integer "other",     null: false
    t.integer "unknown",   null: false
  end

  add_index "locations", ["area_id"], name: "index_locations_on_area_id", using: :btree
  add_index "locations", ["gender_id"], name: "index_locations_on_gender_id", using: :btree
  add_index "locations", ["year_id"], name: "index_locations_on_year_id", using: :btree

  create_table "reasons", force: :cascade do |t|
    t.integer "gender_id", null: false
    t.integer "area_id",   null: false
    t.integer "year_id",   null: false
    t.integer "family",    null: false
    t.integer "health",    null: false
    t.integer "life",      null: false
    t.integer "work",      null: false
    t.integer "partner",   null: false
    t.integer "school",    null: false
    t.integer "other",     null: false
    t.integer "unknown",   null: false
  end

  add_index "reasons", ["area_id"], name: "index_reasons_on_area_id", using: :btree
  add_index "reasons", ["gender_id"], name: "index_reasons_on_gender_id", using: :btree
  add_index "reasons", ["year_id"], name: "index_reasons_on_year_id", using: :btree

  create_table "totals", force: :cascade do |t|
    t.integer "gender_id", null: false
    t.integer "area_id",   null: false
    t.integer "year_id",   null: false
    t.integer "number",    null: false
    t.float   "rate",      null: false
  end

  add_index "totals", ["area_id"], name: "index_totals_on_area_id", using: :btree
  add_index "totals", ["gender_id"], name: "index_totals_on_gender_id", using: :btree
  add_index "totals", ["year_id"], name: "index_totals_on_year_id", using: :btree

  create_table "ways", force: :cascade do |t|
    t.integer "gender_id", null: false
    t.integer "area_id",   null: false
    t.integer "year_id",   null: false
    t.integer "hanging",   null: false
    t.integer "poison",    null: false
    t.integer "briquet",   null: false
    t.integer "jumping",   null: false
    t.integer "diving",    null: false
    t.integer "other",     null: false
    t.integer "unknown",   null: false
  end

  add_index "ways", ["area_id"], name: "index_ways_on_area_id", using: :btree
  add_index "ways", ["gender_id"], name: "index_ways_on_gender_id", using: :btree
  add_index "ways", ["year_id"], name: "index_ways_on_year_id", using: :btree

  create_table "years", force: :cascade do |t|
    t.integer "content", null: false
    t.string  "name",    null: false
  end

  add_foreign_key "ages", "areas"
  add_foreign_key "ages", "genders"
  add_foreign_key "ages", "years"
  add_foreign_key "attempteds", "areas"
  add_foreign_key "attempteds", "genders"
  add_foreign_key "attempteds", "years"
  add_foreign_key "days", "areas"
  add_foreign_key "days", "genders"
  add_foreign_key "days", "years"
  add_foreign_key "hours", "areas"
  add_foreign_key "hours", "genders"
  add_foreign_key "hours", "years"
  add_foreign_key "housemates", "areas"
  add_foreign_key "housemates", "genders"
  add_foreign_key "housemates", "years"
  add_foreign_key "jobs", "areas"
  add_foreign_key "jobs", "genders"
  add_foreign_key "jobs", "years"
  add_foreign_key "locations", "areas"
  add_foreign_key "locations", "genders"
  add_foreign_key "locations", "years"
  add_foreign_key "reasons", "areas"
  add_foreign_key "reasons", "genders"
  add_foreign_key "reasons", "years"
  add_foreign_key "totals", "areas"
  add_foreign_key "totals", "genders"
  add_foreign_key "totals", "years"
  add_foreign_key "ways", "areas"
  add_foreign_key "ways", "genders"
  add_foreign_key "ways", "years"
end
