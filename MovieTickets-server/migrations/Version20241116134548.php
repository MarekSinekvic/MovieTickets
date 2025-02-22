<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241116134548 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE movie (id SERIAL NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE show (id SERIAL NOT NULL, movie_id INT NOT NULL, theater_id INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_320ED9018F93B6FC ON show (movie_id)');
        $this->addSql('CREATE INDEX IDX_320ED901D70E4479 ON show (theater_id)');
        $this->addSql('CREATE TABLE theater (id SERIAL NOT NULL, name VARCHAR(255) NOT NULL, seats_count INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE ticket (id SERIAL NOT NULL, show_id INT NOT NULL, client_id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_97A0ADA3D0C1FC64 ON ticket (show_id)');
        $this->addSql('CREATE INDEX IDX_97A0ADA319EB6921 ON ticket (client_id)');
        $this->addSql('CREATE TABLE "user" (id SERIAL NOT NULL, uuid VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_IDENTIFIER_UUID ON "user" (uuid)');
        $this->addSql('ALTER TABLE show ADD CONSTRAINT FK_320ED9018F93B6FC FOREIGN KEY (movie_id) REFERENCES movie (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE show ADD CONSTRAINT FK_320ED901D70E4479 FOREIGN KEY (theater_id) REFERENCES theater (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE ticket ADD CONSTRAINT FK_97A0ADA3D0C1FC64 FOREIGN KEY (show_id) REFERENCES show (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE ticket ADD CONSTRAINT FK_97A0ADA319EB6921 FOREIGN KEY (client_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE show DROP CONSTRAINT FK_320ED9018F93B6FC');
        $this->addSql('ALTER TABLE show DROP CONSTRAINT FK_320ED901D70E4479');
        $this->addSql('ALTER TABLE ticket DROP CONSTRAINT FK_97A0ADA3D0C1FC64');
        $this->addSql('ALTER TABLE ticket DROP CONSTRAINT FK_97A0ADA319EB6921');
        $this->addSql('DROP TABLE movie');
        $this->addSql('DROP TABLE show');
        $this->addSql('DROP TABLE theater');
        $this->addSql('DROP TABLE ticket');
        $this->addSql('DROP TABLE "user"');
    }
}
