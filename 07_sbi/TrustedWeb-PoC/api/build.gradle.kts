import java.net.URI

plugins {
    kotlin("jvm") version "1.9.0"
    id("io.ktor.plugin") version "2.3.3"
    id("org.jetbrains.kotlin.plugin.serialization") version "1.9.0"
    id("com.jetbrains.exposed.gradle.plugin") version "0.2.1"
    id("org.jlleitschuh.gradle.ktlint") version "11.5.1"
    id("com.gorylenko.gradle-git-properties") version "2.4.1"
}

group = "com.ttw.api"
version = "0.0.1"

application {
    mainClass.set("io.ktor.server.netty.EngineMain")
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}

repositories {
    mavenCentral()
    // java-multibase のため
    maven { url = URI("https://maven.scijava.org/content/repositories/public/") }
}

dependencies {
    implementation("io.ktor:ktor-server-core")
    implementation("io.ktor:ktor-server-netty")
    implementation("io.ktor:ktor-serialization-jackson")
    implementation("io.ktor:ktor-server-content-negotiation")
    implementation("io.ktor:ktor-server-status-pages")

    implementation("io.ktor:ktor-client-core")
    implementation("io.ktor:ktor-client-cio")
    implementation("io.ktor:ktor-client-logging")
    implementation("io.ktor:ktor-client-content-negotiation")

    implementation(platform("org.jetbrains.exposed:exposed-bom:0.42.1"))
    implementation("org.jetbrains.exposed:exposed-core")
    implementation("org.jetbrains.exposed:exposed-json")
    implementation("org.jetbrains.exposed:exposed-jdbc")
    implementation("org.jetbrains.exposed:exposed-java-time")
    implementation("io.ktor:ktor-server-openapi")
    implementation("io.ktor:ktor-server-auto-head-response-jvm")
    implementation("io.ktor:ktor-server-netty-jvm")
    implementation("ch.qos.logback:logback-classic:1.4.11")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.15.2")
    implementation("org.bouncycastle:bcpkix-jdk18on:1.76")
    implementation("com.github.multiformats:java-multibase:1.1.1")

    runtimeOnly("org.postgresql:postgresql:42.6.0")

    testImplementation("io.ktor:ktor-server-tests-jvm")
    testImplementation(platform("io.kotest:kotest-bom:5.7.2"))
    testImplementation("io.kotest:kotest-runner-junit5")
    testImplementation("io.kotest:kotest-assertions-core")
    testImplementation("io.kotest:kotest-assertions-json")
    testImplementation("io.kotest.extensions:kotest-extensions-wiremock:2.0.1")
    testImplementation("io.mockk:mockk:1.13.7")
}

tasks.withType<Test>().configureEach {
    useJUnitPlatform()
}

val tablesDirectory = "src/main/kotlin"
val tablesPackage = "com.ttw.api.infrastructure.models"
val tablesFileName = "Tables"

exposedCodeGeneratorConfig {
    connectionURL = System.getenv("DATABASE_URL")
    packageName = tablesPackage
    generatedFileName = tablesFileName
    outputDirectory = objects.directoryProperty().convention(
        layout.projectDirectory.dir(tablesDirectory)
    )
}

tasks {
    ktlint {
        filter(
            Action {
                exclude("**/Tables.kt")
            }
        )
    }
    generateExposedCode {
        doLast {
            file("$tablesDirectory/${tablesPackage.replace('.', '/')}/$tablesFileName.kt").also {
                val replaced = it.readText()
                    // プラグインのバグによる正しくない出力を修正する
                    // 将来プラグインのバグが修正されたら削除する
                    .replace("`java-time`", "javatime")
                    .replace("import PrimaryKey\n", "")
                    // 非推奨要素を使わないように変更
                    // (DAO用の要素でありDSLでは使うべきでない要素を削除)
                    .replace("""import org\.jetbrains\.exposed\.dao\.id\.(EntityID|IdTable)\n""".toRegex(), "")
                    .replace("IdTable<String>", "Table")
                    .replace("""override val (.+?): Column<EntityID<String>> = (.+?)\.entityId\(\)""".toRegex(), "val $1: Column<String> = $2")
                    .replace("""object (.+?) :""".toRegex(), "object $1s :")
                    .replace("import org.jetbrains.exposed.dao.id.IntIdTable", "import org.jetbrains.exposed.sql.Table")
                it.writeText(replaced)
            }
        }
    }
}
