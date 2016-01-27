class CreateJobs < ActiveRecord::Migration
  def change
    create_table :jobs do |t|
      t.references :gender, index: true, foreign_key: true
      t.references :area, index: true, foreign_key: true
      t.references :year, index: true, foreign_key: true
      t.integer :self_employed
      t.integer :employed
      t.integer :total_unemployed
      t.integer :student
      t.integer :unemployed
      t.integer :stay_at_home
      t.integer :pensioner
      t.integer :unknown

      t.timestamps null: false
    end
  end
end
