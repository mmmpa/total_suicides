class CreateJobs < ActiveRecord::Migration
  def change
    create_table :jobs do |t|
      t.references :gender, index: true, foreign_key: true, null: false
      t.references :area, index: true, foreign_key: true, null: false
      t.references :year, index: true, foreign_key: true, null: false
      t.integer :self_employed, null: false
      t.integer :employed, null: false
      t.integer :total_unemployed, null: false
      t.integer :student, null: false
      t.integer :not_student, null: false
      t.integer :unemployed, null: false
      t.integer :stay_at_home, null: false
      t.integer :pensioner, null: false
      t.integer :unknown, null: false
    end
  end
end
